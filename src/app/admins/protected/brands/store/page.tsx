"use client";

import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import sendRequest from "@/functions/sendRequest";
import { display } from "@/redux/DisplayToast";
import { Button, Card, Input } from "@/components";
import { languages } from "@/constants";
import InitialErrors from "@/interfaces/states/InitialErrors";

const initialErrors: InitialErrors = {};

const StoreBrand = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [errors, setErrors] = useState<InitialErrors>(initialErrors);
    const router = useRouter();
    const abortController = useRef<AbortController | null>(null);

    // Initialize inputs with brands array for each language
    const [inputs, setInputs] = useState<{
        brands: Array<{ name: string; trans_lang: string }>;
    }>({
        brands: languages().map((lang) => ({
            name: "",
            trans_lang: lang.abbre,
        })),
    });

    // MARK: handleChange
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

    // MARK: handleSubmit
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        const token = localStorage.getItem("adminToken");
        const url = `/admin-panel/brand`;

        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();

        const submitData = async () => {
            const response = await sendRequest(
                "post",
                url,
                inputs,
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
                        isLoading={isLoading}
                        text="add"
                        classes="bg-indigo-700 hover:bg-indigo-800 w-full flex justify-center my-5"
                    ></Button>
                </form>
            </div>
        </div>
    );
};

export default StoreBrand;
