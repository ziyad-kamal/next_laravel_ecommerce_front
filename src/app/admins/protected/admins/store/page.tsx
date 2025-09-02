"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import sendRequest from "@/functions/sendRequest";
import { display } from "@/redux/DisplayToast";
import { Button, Card, Input } from "@/components";

const initialErrors = {
    name: [],
    password: [],
    email: [],
};

const ShowAdmin = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [errors, setErrors] = useState(initialErrors);
    const router = useRouter();

    const [inputs, setInputs] = useState<{
        name: string;
        email: string;
        password: string;
        passwordConfirmation: string;
    }>({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
    });

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        name: string
    ) => {
        const value = e.target.value;
        setInputs({ ...inputs, [name]: value });
    };

    let abortControllerForSubmit: AbortController | null = null;

    // MARK: handleSubmit
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem("adminToken");
        const url = `/admin-panel/admin`;
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
            <div className="flex justify-center items-center h-100 my-30">
                <Card>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Add Admin
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="name"
                            name="name"
                            type={"text"}
                            handleChange={handleInputChange}
                            classes=" text-black 
                                        border-gray-300 
                                        focus:ring-indigo-500 
                                        bg-white/50 "
                            error={errors.name[0]}
                            value={inputs.name ?? ""}
                        />

                        <Input
                            label="email"
                            name="email"
                            type="email"
                            handleChange={handleInputChange}
                            classes=" text-black 
                                        border-gray-300 
                                        focus:ring-indigo-500 
                                        bg-white/50 "
                            error={errors.email[0]}
                            value={inputs.email ?? ""}
                        />

                        <Input
                            label="password"
                            name="password"
                            type={"password"}
                            handleChange={handleInputChange}
                            classes=" text-black 
                                        border-gray-300 
                                        focus:ring-indigo-500 
                                        bg-white/50 "
                            error={errors.password[0]}
                        />

                        <Input
                            label="confirm the password"
                            name="password_confirmation"
                            type={"password"}
                            handleChange={handleInputChange}
                            classes=" text-black 
                                        border-gray-300 
                                        focus:ring-indigo-500 
                                        bg-white/50 "
                            placeholder="enter your password again"
                        />

                        <Button
                            disable={isLoading}
                            classes="bg-indigo-700 hover:bg-indigo-800 w-full flex justify-center mt-5"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin text-white  rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    add ...
                                </div>
                            ) : (
                                <div className="flex text-white items-center">
                                    add
                                </div>
                            )}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ShowAdmin;
