"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import sendRequest from "@/functions/sendRequest";
import { display } from "@/redux/DisplayToast";
import { Button, Card, Input } from "@/components";
import { languages } from "@/constants";
import InitialErrors from "@/interfaces/states/InitialErrors";

const initialErrors: InitialErrors = {};

const ShowBrand = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [errors, setErrors] = useState<InitialErrors>(initialErrors); // Changed to any to handle dynamic error keys
    const router = useRouter();

    // Initialize inputs with brands array for each language
    const [inputs, setInputs] = useState<{
        brands: Array<{ name: string; trans_lang: string }>;
    }>({
        brands: languages().map((lang) => ({
            name: "",
            trans_lang: lang.abbre,
        })),
    });

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        langIndex: number
    ) => {
        const value = e.target.value;
        setInputs((prevInputs) => ({
            ...prevInputs,
            brands: prevInputs.brands.map((brand, index) =>
                index === langIndex ? { ...brand, name: value } : brand
            ),
        }));
    };

    let abortControllerForSubmit: AbortController | null = null;

    // MARK: handleSubmit
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        const token = localStorage.getItem("adminToken");
        const url = `/admin-panel/brand`;

        if (abortControllerForSubmit) {
            abortControllerForSubmit.abort();
        }
        abortControllerForSubmit = new AbortController();

        const submitData = async () => {
            const response = await sendRequest(
                "post",
                url,
                inputs,
                abortControllerForSubmit,
                token,
                router
            );
            setErrors(initialErrors);

            if (response && response.success) {
                dispatch(
                    display({ type: "success", message: response.msg.text })
                );
                setIsLoading(false);
                // Reset form after successful submission
                setInputs({
                    brands: languages().map((lang) => ({
                        name: "",
                        trans_lang: lang.abbre,
                    })),
                });
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
            <div className="flex flex-col justify-center items-center h-100 mt-70">
                <form onSubmit={handleSubmit}>
                    {languages().map((lang, i) => (
                        <Card key={i}>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Add Brand {`in ${lang.name}`}
                                </h1>
                            </div>

                            <div className="mb-4">
                                <Input
                                    label={`Brand Name`}
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
                                        errors[`brands.${i}.name`]
                                            ? errors[`brands.${i}.name`][0]
                                            : ""
                                    }
                                    value={inputs.brands[i]?.name || ""}
                                />
                            </div>
                        </Card>
                    ))}

                    <Button
                        disable={isLoading}
                        classes="bg-indigo-700 hover:bg-indigo-800 w-full flex justify-center my-5"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin text-white rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Adding Brand...
                            </div>
                        ) : (
                            <div className="flex text-white items-center">
                                Add Brand
                            </div>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ShowBrand;
