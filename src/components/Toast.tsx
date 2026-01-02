import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import ToastState from "@/interfaces/states/ToastState";
import { hide } from "@/redux/DisplayToast";
import { CheckCircle, AlertCircle, XCircle, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const Toast = () => {
    const toastState = useAppSelector(
        (state: { displayToast: ToastState }) => state.displayToast
    );
    const dispatch = useAppDispatch();
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [IsInitialVisible, setIsInitialVisible] = useState(false); // for entrance animation
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const animTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (toastState.isVisible) {
            setIsAnimatingOut(false);
            setIsInitialVisible(false);
            // Trigger entrance animation on next tick
            requestAnimationFrame(() => setIsInitialVisible(true));
            timerRef.current = setTimeout(() => {
                setIsAnimatingOut(true);
                animTimerRef.current = setTimeout(() => {
                    dispatch(hide());
                }, 300);
            }, 4000);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (animTimerRef.current) clearTimeout(animTimerRef.current);
        };
    }, [toastState.isVisible, dispatch]);

    const handleClose = () => {
        setIsAnimatingOut(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        animTimerRef.current = setTimeout(() => {
            dispatch(hide());
        }, 300);
    };

    const getToastStyles = () => {
        const baseStyles =
            "flex items-center gap-3 p-4 rounded-lg shadow-lg border max-w-md";

        switch (toastState.type) {
            case "success":
                return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
            case "error":
                return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
            case "warning":
                return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
            default:
                return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
        }
    };

    const getIcon = () => {
        switch (toastState.type) {
            case "success":
                return (
                    <CheckCircle className="text-green-500 flex-shrink-0 w-5 h-5" />
                );
            case "error":
                return (
                    <XCircle className="text-red-500 flex-shrink-0 w-5 h-5" />
                );
            case "warning":
                return (
                    <AlertCircle className="text-yellow-500 flex-shrink-0 w-5 h-5" />
                );
        }
    };

    if (!toastState.isVisible) return null;

    return (
        <div
            className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
                isAnimatingOut
                    ? "translate-x-full opacity-0"
                    : IsInitialVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
            }`}
        >
            <div className={getToastStyles()}>
                {getIcon()}
                <p className="flex-1 text-sm font-medium">
                    {toastState.message}
                </p>
                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 p-1"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
