interface DropzoneProps<T = object> {
    className?: string;
    setInputs: React.Dispatch<
        React.SetStateAction<{
            items: Array<T>;
            images: string[];
        }>
    >;
}

export default DropzoneProps;
