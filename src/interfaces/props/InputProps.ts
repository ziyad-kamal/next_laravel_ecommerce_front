import { ChangeEvent, RefObject } from "react";

interface InputProps {
    label?: string;
    name: string;
    classes?: string;
    type?: string;
    placeholder?: string;
    isRequired?: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>, name: string) => void;
    inputRef?: RefObject<HTMLInputElement>;
    value?: string;
    error?: string;
}

export default InputProps;
