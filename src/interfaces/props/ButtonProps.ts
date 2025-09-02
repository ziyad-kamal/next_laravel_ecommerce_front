import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { MouseEvent } from "react";

interface ButtonProps {
    handleClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    text: string;
    classes?: string;
    type?: "submit" | "reset" | "button"; // Restrict to valid button types
    icon?: IconProp;
    children?: React.ReactNode;
    isLoading?: boolean;
}

export default ButtonProps;
