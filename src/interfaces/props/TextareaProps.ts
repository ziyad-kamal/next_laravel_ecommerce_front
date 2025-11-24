import { ChangeEvent, RefObject } from "react";

interface TextareaProps {
    label?: string;
    name: string;
    classes?: string;
    type?: string;
    placeholder?: string;
    isRequired?: boolean;
    handleChange: (e: ChangeEvent<HTMLTextAreaElement>, name: string) => void;
    inputRef?: RefObject<HTMLTextAreaElement>;
    value?: string | number;
    error?: string;
    accept?: string;
    cols?: number;
    rows?: number;
}

export default TextareaProps;
