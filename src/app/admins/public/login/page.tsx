"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faEnvelope,
    faEye,
    faEyeSlash,
    faLock,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Input } from "@/components";
import sendRequest from "@/functions/sendRequest";
import { useAppDispatch } from "@/lib/hooks";
import { display } from "@/redux/DisplayToast";
import { useRouter } from "next/navigation";
import { adminTokenSet } from "@/redux/SetToken";

const initialInputs: { email: string; password: string; rememberMe: boolean } =
    {
        email: "",
        password: "",
        rememberMe: false,
    };

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState(initialInputs);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        name: string
    ) => {
        const { value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    let abortControllerForSubmit: AbortController | null = null;
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        const url = `/admin-panel/login`;
        const token = localStorage.getItem("adminToken");

        if (abortControllerForSubmit) {
            abortControllerForSubmit.abort();
        }
        abortControllerForSubmit = new AbortController();

        const submitData = async () => {
            const response = await sendRequest(
                "post",
                url,
                formData,
                abortControllerForSubmit,
                token
            );

            if (response && response.success) {
                dispatch(
                    display({ type: "success", message: response.msg.text })
                );
                localStorage.setItem("adminToken", response.data.data.token);
                dispatch(adminTokenSet());

                setIsLoading(false);
                router.push("/admins/protected/dashboard");
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
                setIsLoading(false);
            }
        };

        submitData();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="relative w-full max-w-md">
                {/* Main login card */}
                <Card>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                            <FontAwesomeIcon
                                icon={faLock}
                                className="w-8 h-8 text-white text-2xl"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Admin login
                        </h1>
                        <p className="text-gray-600">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Login form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Email field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon
                                        icon={faEnvelope}
                                        className="h-5 w-5 text-indigo-700"
                                    />
                                </div>
                                <Input
                                    name="email"
                                    type="email"
                                    handleChange={handleInputChange}
                                    classes=" text-black 
                                        border-gray-300 
                                        focus:ring-indigo-500 
                                        bg-white/50 "
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="h-5 w-5 text-indigo-700"
                                    />
                                </div>
                                <Input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    handleChange={handleInputChange}
                                    classes=" text-black 
                                        border-gray-300 
                                        focus:ring-indigo-500 
                                        bg-white/50 "
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <FontAwesomeIcon
                                            icon={faEyeSlash}
                                            className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faEye}
                                            className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit button */}
                        <Button
                            disable={isLoading}
                            classes="bg-indigo-700 hover:bg-indigo-800 w-full flex justify-center"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin text-white  rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                <div className="flex text-white items-center">
                                    Sign in
                                    <FontAwesomeIcon
                                        icon={faArrowRight}
                                        className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                                    />
                                </div>
                            )}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
