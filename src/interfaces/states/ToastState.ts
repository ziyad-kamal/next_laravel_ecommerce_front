interface ToastState {
    isVisible: boolean;
    type: "success" | "error" | "warning";
    message: string;
}

export default ToastState;
