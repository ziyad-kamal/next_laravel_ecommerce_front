import Image from "next/image";
import { useCallback, useEffect, useState, FormEvent } from "react";
import { useDropzone, FileRejection } from "react-dropzone";

import DropzoneProps from "@/interfaces/props/DropzoneProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import Button from "./Button";

const Dropzone = ({ className }: DropzoneProps) => {
    const [files, setFiles] = useState<(File & { preview: string })[]>([]);
    const [rejected, setRejected] = useState<
        { file: File; errors: Array<{ code: string; message: string }> }[]
    >([]);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (acceptedFiles?.length) {
                setFiles((previousFiles) => [
                    ...previousFiles,
                    ...acceptedFiles.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file),
                        })
                    ),
                ]);
            }

            if (fileRejections?.length) {
                setRejected((previousFiles) => [
                    ...previousFiles,
                    ...fileRejections.map(({ file, errors }) => ({
                        file,
                        errors: errors.map((error) => ({
                            code: error.code,
                            message: error.message,
                        })),
                    })),
                ]);
            }
        },
        []
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/*": [],
        },
        maxSize: 1024 * 1000,
        onDrop,
    });

    useEffect(() => {
        // Revoke the data uris to avoid memory leaks
        return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    const removeFile = (name: string) => {
        setFiles((files) => files.filter((file) => file.name !== name));
    };

    const removeAll = () => {
        setFiles([]);
        setRejected([]);
    };

    const removeRejected = (name: string) => {
        setRejected((files) => files.filter(({ file }) => file.name !== name));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!files?.length) return;

        const formData = new FormData();
        files.forEach((file) => formData.append("file", file));
        formData.append("upload_preset", "friends");

        const uploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
        if (!uploadUrl) {
            console.error("Cloudinary URL is not defined");
            return;
        }

        try {
            const response = await fetch(uploadUrl, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(
                    `Upload failed with status: ${response.status}`
                );
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div
                {...getRootProps({
                    className: className,
                })}
            >
                <input {...getInputProps()} />
                <div className="flex  flex-col cursor-pointer items-center justify-center gap-4">
                    <FontAwesomeIcon
                        icon={faArrowUp}
                        className="w-5 h-5 fill-current"
                    />
                    {isDragActive ? (
                        <p>Drop the files here ...</p>
                    ) : (
                        <p>Drag & drop files here, or click to select files</p>
                    )}
                </div>
            </div>

            {/* Preview */}
            <section className="mt-10">
                <div className="flex gap-4">
                    <h2 className="title text-3xl font-semibold">Preview</h2>
                    <Button
                        text="Remove all files"
                        classes="bg-red-500 hover:bg-red-600"
                        handleClick={removeAll}
                    />
                </div>

                {/* Accepted files */}
                <h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3">
                    Accepted Files
                </h3>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
                    {files.map((file) => (
                        <li
                            key={file.name}
                            className="relative h-32 rounded-md shadow-lg mb-10"
                        >
                            <Image
                                src={file.preview}
                                alt={file.name}
                                width={100}
                                height={100}
                                onLoad={() => {
                                    URL.revokeObjectURL(file.preview);
                                }}
                                className="h-full w-full object-contain rounded-md"
                            />
                            <button
                                type="button"
                                className="w-7 h-7 border cursor-pointer  bg-red-500 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-red-600 transition-colors"
                                onClick={() => removeFile(file.name)}
                            >
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="w-5 h-5  hover:fill-secondary-400 transition-colors"
                                />
                            </button>
                            <p className="mt-2 text-neutral-500 text-[12px] font-medium">
                                {file.name}
                            </p>
                        </li>
                    ))}
                </ul>

                {/* Rejected Files */}
                {rejected.length > 0 ? (
                    <>
                        <h3 className="title text-lg font-semibold text-neutral-600 mt-24 border-b pb-3">
                            Rejected Files
                        </h3>
                        <ul className="mt-6 flex flex-col">
                            {rejected.map(({ file, errors }) => (
                                <li
                                    key={file.name}
                                    className="flex items-start justify-between"
                                >
                                    <div>
                                        <p className="mt-2 text-neutral-500 text-sm font-medium">
                                            {file.name}
                                        </p>
                                        <ul className="text-[12px] text-red-400">
                                            {errors.map((error) => (
                                                <li key={error.code}>
                                                    {error.message}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        type="button"
                                        className="mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors"
                                        onClick={() =>
                                            removeRejected(file.name)
                                        }
                                    >
                                        remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : null}
            </section>
        </form>
    );
};

export default Dropzone;
