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
import { userTokenSet } from "@/redux/SetToken";

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

        const url = `/login`;
        if (abortControllerForSubmit) {
            abortControllerForSubmit.abort();
        }
        abortControllerForSubmit = new AbortController();

        const submitData = async () => {
            const response = await sendRequest(
                "post",
                url,
                formData,
                abortControllerForSubmit
            );

            if (response && response.success) {
                dispatch(
                    display({ type: "success", message: response.msg.text })
                );
                localStorage.setItem("token", response.data.data.token);
                dispatch(userTokenSet());

                setIsLoading(false);
                router.push("/users/protected/home");
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
                            Welcome Back
                        </h1>
                        <p className="text-gray-600">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Social login buttons */}
                    <div className="my-6 flex justify-center gap-3">
                        <Button classes="bg-white hover:bg-gray-200 text-gray-500 border border-gray-300">
                            <svg
                                className="h-5 w-5 "
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    className="text-blue-600"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    className="text-green-600"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    className="text-amber-300"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    className="text-red-600"
                                />
                            </svg>
                            <span className="mx-2 text-lg">Google</span>
                        </Button>

                        <Button classes="bg-white hover:bg-gray-200 text-gray-500 border border-gray-300">
                            <svg
                                className="h-5 w-5 text-blue-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                            <span className="mx-2 text-lg">Twitter</span>
                        </Button>
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

                        {/* Remember me and forgot password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    name="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) =>
                                        handleInputChange(e, "rememberMe")
                                    }
                                />
                                <label
                                    htmlFor="rememberMe"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Remember me
                                </label>
                            </div>
                            <a
                                href="#"
                                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                            >
                                Forgot password?
                            </a>
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

                    {/* Sign up link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Do not have an account?{" "}
                        <a
                            href="#"
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            Sign up for free
                        </a>
                    </p>
                </Card>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        By signing in, you agree to our{" "}
                        <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-500"
                        >
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-500"
                        >
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
