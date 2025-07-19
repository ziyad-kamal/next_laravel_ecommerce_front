import ToastState from "./ToastState";

interface ToastPayload {
    type: ToastState["type"];
    message: string;
}

export default ToastPayload;
