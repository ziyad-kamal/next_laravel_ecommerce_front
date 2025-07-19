import { ChangeEvent, RefObject } from "react";

interface InputProps {
    name: string;
    classes?: string;
    type?: string;
    placeholder?: string;
    isRequired?: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>, name: string) => void;
    inputRef?: RefObject<HTMLInputElement>;
    error?: string;
}

export default InputProps;
