import { MouseEvent } from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps {
    handleClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    text: string;
    classes?: string;
    type?: "submit" | "reset" | "button"; // Restrict to valid button types
    icon?: LucideIcon;
    children?: React.ReactNode;
    isLoading?: boolean;
}

export default ButtonProps;
