import { ChangeEvent } from "react";
import Option from "./Option";

interface SelectInputProps {
    options: Option[];
    placeholder?: string;
    value?: string | number;
    handleChange: (e: ChangeEvent<HTMLSelectElement>, name: string) => void;
    disabled?: boolean;
    error?: string;
    label?: string;
    className?: string;
    name: string;
}

export default SelectInputProps;
