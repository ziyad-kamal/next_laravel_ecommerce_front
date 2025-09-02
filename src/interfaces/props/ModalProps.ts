import { MouseEvent } from "react";

interface ModalProps {
    title?: string;
    children: React.ReactNode;
    handleClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default ModalProps;
