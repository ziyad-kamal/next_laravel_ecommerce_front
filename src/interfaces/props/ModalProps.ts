import { MouseEvent } from "react";

interface ModalProps {
    title?: string;
    children: React.ReactNode;
    handleClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    isOpen?: boolean;
    onClose?: () => void;
    modalType?: "filter" | "delete" | "update" | "confirm";
    actionButtonText?: string;
    isLoading?: boolean;
}

export default ModalProps;
