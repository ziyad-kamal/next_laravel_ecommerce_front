"use client";

import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
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

const initialInputs: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
} = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
};

const StoreAdmin = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [errors, setErrors] = useState(initialErrors);
    const router = useRouter();
    const [inputs, setInputs] = useState(initialInputs);
    const abortController = useRef<AbortController | null>(null);

    // MARK: handleChange
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        name: string
    ) => {
        const value = e.target.value;
        setInputs({ ...inputs, [name]: value });
    };

    // MARK: handleSubmit
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const token = localStorage.getItem("adminToken");
        const url = `/admin-panel/admin`;

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
                setInputs(initialInputs);
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
                            value={inputs.password ?? ""}
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
                            value={inputs.password_confirmation ?? ""}
                        />

                        <Button
                            isLoading={isLoading}
                            text="add"
                            classes="bg-indigo-700 hover:bg-indigo-800 w-full flex justify-center mt-5"
                        ></Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default StoreAdmin;
