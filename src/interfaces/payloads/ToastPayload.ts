import ToastState from "../states/ToastState";

interface ToastPayload {
    type: ToastState["type"];
    message: string;
}

export default ToastPayload;
