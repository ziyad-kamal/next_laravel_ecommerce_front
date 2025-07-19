import axios from "axios";

export default function sendRequest(
    method: "post" | "get" | "put" | "delete",
    url: string,
    inputs: object | null,
    abortController: AbortController | null
) {
    const send = async () => {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        axios.defaults.baseURL = "http://127.0.0.1:8000/api/";
        axios.defaults.headers.post["Content-Type"] = "application/json";

        try {
            let response;
            if (method == "get") {
                response = await axios.get(url, {
                    signal: abortController?.signal,
                });
            } else if (method == "post") {
                response = await axios.post(url, inputs, {
                    signal: abortController?.signal,
                });
            } else {
                response = await axios.delete(url, {
                    signal: abortController?.signal,
                });
            }

            if (response.status === 200) {
                return {
                    success: true,
                    data: response.data,
                    msg: {
                        show: true,
                        type: "success",
                        text: response.data.message,
                    },
                };
            } else if (response.status === 201) {
                return {
                    success: true,
                    data: response.data,
                    msg: {
                        show: true,
                        type: "success",
                        text: response.data.message,
                    },
                };
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                if (status === 401) {
                    localStorage.removeItem("token");
                } else if (status === 404) {
                    return {
                        success: false,
                        msg: {
                            show: true,
                            type: "error",
                            text: error.response.data.message,
                        },
                    };
                } else if (status === 422) {
                    return {
                        success: false,
                        msg: {
                            show: true,
                            type: "error",
                            text: "correct errors below each input",
                        },
                        errors: error.response.data.errors,
                    };
                } else if (status === 429) {
                    return {
                        success: false,
                        msg: {
                            show: true,
                            type: "error",
                            text: "you send many requests, try again later",
                        },
                    };
                } else {
                    return {
                        success: false,
                        msg: {
                            show: true,
                            type: "error",
                            text: "something went wrong",
                        },
                    };
                }
            } else if (axios.isAxiosError(error) && error.request) {
                if (!axios.isCancel(error)) {
                    return {
                        success: false,
                        msg: {
                            show: true,
                            type: "error",
                            text: "no response received,try again later.",
                        },
                    };
                }
            } else {
                return {
                    success: false,
                    msg: {
                        show: true,
                        type: "error",
                        text: "something went wrong",
                    },
                };
            }
        }
    };

    return send();
}
