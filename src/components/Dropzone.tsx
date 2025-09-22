import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";

import DropzoneProps from "@/interfaces/props/DropzoneProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import Button from "./Button";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import sendRequest from "@/functions/sendRequest";
import { display } from "@/redux/DisplayToast";

const Dropzone = <T extends object>({
    className,
    setInputs,
}: DropzoneProps<T>) => {
    const dispatch = useAppDispatch();
    const abortController = useRef<AbortController | null>(null);
    const router = useRouter();

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

                const token = localStorage.getItem("adminToken");
                const url = `/admin-panel/file/upload`;

                if (abortController.current) {
                    abortController.current.abort();
                }
                abortController.current = new AbortController();

                acceptedFiles.forEach((file) => {
                    const submitData = async () => {
                        const formData = new FormData();

                        formData.append("image", file);

                        const response = await sendRequest(
                            "post",
                            url,
                            formData,
                            abortController.current,
                            token,
                            router
                        );
                        // setErrors(initialErrors);

                        if (response && response.success) {
                            dispatch(
                                display({
                                    type: "success",
                                    message: response.msg.text,
                                })
                            );

                            setInputs((prevInputs) => ({
                                ...prevInputs,
                                images: [
                                    ...prevInputs.images,
                                    response.data.path,
                                ],
                            }));
                        } else if (response) {
                            dispatch(
                                display({
                                    type: "error",
                                    message: response.msg.text,
                                })
                            );

                            if (response.errors) {
                                // setErrors(response.errors);
                            }
                        }
                    };

                    submitData();
                });
                // acceptedFiles.forEach(file=>{
                //     setInputs((preFile) => ({
                //         ...preFile,
                //         image: [...preFile.image, URL.createObjectURL(file)],
                //     }));
                // })
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
        [dispatch, router, setInputs]
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

    const removeAllFiles = () => {
        setFiles([]);
        setRejected([]);
    };

    const removeRejected = (name: string) => {
        setRejected((files) => files.filter(({ file }) => file.name !== name));
    };

    return (
        <>
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
                        handleClick={removeAllFiles}
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
        </>
    );
};

export default Dropzone;
