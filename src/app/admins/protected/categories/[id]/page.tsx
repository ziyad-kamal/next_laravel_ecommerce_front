"use client";

import React, {
    ChangeEvent,
    FormEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import Image from "next/image";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import sendRequest from "@/functions/sendRequest";
import { display } from "@/redux/DisplayToast";
import { Button, Card, Input } from "@/components";
import { languages } from "@/constants";
import InitialErrors from "@/interfaces/states/InitialErrors";

const initialErrors: InitialErrors = {};

const UpdateCategory = ({ params }: { params: Promise<{ id: number }> }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [errors, setErrors] = useState<InitialErrors>(initialErrors);
    const router = useRouter();
    const abortController = useRef<AbortController | null>(null);
    const { id } = React.use(params);

    // Initialize inputs with categories array for each language
    const [inputs, setInputs] = useState<{
        categories: Array<{
            name: string;
            trans_lang: string;
            id: number | null;
        }>;
        image: File | null;
    }>({
        categories: languages().map((lang) => ({
            name: "",
            trans_lang: lang.abbre,
            id: null,
        })),
        image: null,
    });

    const [imagePreview, setImagePreview] = useState<string>("");

    // MARK: get categories
    useEffect(() => {
        const url = `/admin-panel/category/${id}`;
        const abortController = new AbortController();
        const token = localStorage.getItem("adminToken");

        const fetchData = async () => {
            const response = await sendRequest(
                "get",
                url,
                null,
                abortController,
                token,
                router
            );

            if (response && response.success) {
                if (response && response.success) {
                    const categoriesByLanguage = languages().map((lang) => {
                        const categoryForLang = response.data.data.find(
                            (category: { trans_lang: string }) =>
                                category.trans_lang === lang.abbre
                        );
                        return categoryForLang
                            ? {
                                  name: categoryForLang.name,
                                  id: categoryForLang.id,
                                  trans_lang: categoryForLang.trans_lang,
                              }
                            : {
                                  name: "",
                                  id: 0,
                                  trans_lang: lang.abbre || "",
                              };
                    });

                    setInputs(() => ({
                        categories: categoriesByLanguage.map(
                            ({ name, trans_lang, id }) => ({
                                name,
                                trans_lang,
                                id,
                            })
                        ),
                        image: null,
                    }));

                    setImagePreview(response.data.data[0].image);
                }
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
            }
        };

        fetchData();

        return () => abortController.abort();
    }, [router, dispatch, id]);

    // MARK: handleChange
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        langIndex: number
    ) => {
        const value = e.target.value;
        setInputs((prevInputs) => ({
            ...prevInputs,
            categories: prevInputs.categories.map((category, index) =>
                index === langIndex ? { ...category, name: value } : category
            ),
        }));
    };

    // MARK: ImageChange
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setInputs((prevInputs) => ({
                ...prevInputs,
                image: file,
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // MARK: handleSubmit
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        const token = localStorage.getItem("adminToken");
        const url = `/admin-panel/category/${id}?_method=put`;

        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();

        const submitData = async () => {
            const formData = new FormData();

            // Append image first (required field)
            if (inputs.image) {
                formData.append("image", inputs.image, inputs.image.name); // Add filename explicitly
            }

            // Append each category as a separate array element
            inputs.categories.forEach((category, index) => {
                formData.append(`categories[${index}][name]`, category.name);
                formData.append(
                    `categories[${index}][trans_lang]`,
                    category.trans_lang
                );
                formData.append(
                    `categories[${index}][id]`,
                    category.id !== null ? String(category.id) : ""
                );
            });

            const response = await sendRequest(
                "post",
                url,
                formData,
                abortController.current,
                token,
                router
            );
            setErrors(initialErrors);

            if (response && response.success) {
                dispatch(
                    display({ type: "success", message: response.msg.text })
                );

                setIsLoading(false);
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
                setIsLoading(false);

                if (response.errors) {
                    setErrors(response.errors);
                }
            }
        };

        submitData();
    };

    return (
        <div>
            <div className="flex flex-col justify-center items-center h-100 mt-130">
                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                >
                    <Card>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Category Image
                            </h1>
                        </div>
                        <div className="mb-4">
                            <Input
                                label="image"
                                name="image"
                                type="file"
                                handleChange={handleImageChange}
                                classes="text-black border-gray-300 focus:ring-indigo-500 bg-white/50"
                                error={errors.image ? errors.image[0] : ""}
                                accept="image/*"
                                isRequired={false}
                            />
                            {imagePreview && (
                                <div className="mt-4 relative w-[200px] h-[200px]">
                                    <Image
                                        src={imagePreview}
                                        alt="Category preview"
                                        fill
                                        className="object-contain"
                                        sizes="200px"
                                    />
                                </div>
                            )}
                        </div>
                    </Card>

                    {languages().map((lang, i) => (
                        <Card key={i}>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Add Category
                                </h1>
                                <span>{`(in ${lang.name})`}</span>
                            </div>

                            <div className="mb-4">
                                <Input
                                    label={`Category Name`}
                                    name={`name`}
                                    type="text"
                                    handleChange={(e) =>
                                        handleInputChange(e, i)
                                    }
                                    classes="text-black 
                                            border-gray-300 
                                            focus:ring-indigo-500 
                                            bg-white/50"
                                    error={
                                        errors[`categories.${i}.name`]
                                            ? errors[`categories.${i}.name`][0]
                                            : ""
                                    }
                                    value={inputs.categories[i]?.name || ""}
                                />
                            </div>
                        </Card>
                    ))}

                    <Button
                        isLoading={isLoading}
                        text="update"
                        classes="bg-indigo-700 hover:bg-indigo-800 w-full flex justify-center my-5"
                    ></Button>
                </form>
            </div>
        </div>
    );
};

export default UpdateCategory;
