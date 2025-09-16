"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import sendRequest from "@/functions/sendRequest";
import { display } from "@/redux/DisplayToast";
import { Button, Card, Input } from "@/components";
import { languages } from "@/constants";
import InitialErrors from "@/interfaces/states/InitialErrors";

const initialErrors: InitialErrors = {};

const UpdateBrand = ({ params }: { params: Promise<{ id: number }> }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [errors, setErrors] = useState<InitialErrors>(initialErrors); // Changed to any to handle dynamic error keys
    const router = useRouter();
    const { id } = React.use(params);

    // Initialize inputs with brands array for each language
    const [inputs, setInputs] = useState<{
        brands: Array<{ name: string; id: number; trans_lang: string }>;
    }>({
        brands: languages().map(() => ({
            name: "",
            id: 0,
            trans_lang: "",
        })),
    });

    // MARK: get brands
    useEffect(() => {
        const url = `/admin-panel/brand/${id}`;
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
                    const brandsByLanguage = languages().map((lang) => {
                        const brandForLang = response.data.data.find(
                            (brand: { trans_lang: string }) =>
                                brand.trans_lang === lang.abbre
                        );
                        return brandForLang
                            ? {
                                  name: brandForLang.name,
                                  id: brandForLang.id,
                                  trans_lang: brandForLang.trans_lang,
                              }
                            : {
                                  name: "",
                                  id: 0,
                                  trans_lang: lang.abbre || "",
                              };
                    });

                    setInputs({ brands: brandsByLanguage });
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

    // MARK: InputChange
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
        const url = `/admin-panel/brand/${id}?_method=put`;
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
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
                setIsLoading(false);

                if (response.errors) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        ...response.errors,
                    }));
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
                        text="update"
                        classes="bg-indigo-700 hover:bg-indigo-800 w-full flex justify-center my-5"
                    ></Button>
                </form>
            </div>
        </div>
    );
};

export default UpdateBrand;
