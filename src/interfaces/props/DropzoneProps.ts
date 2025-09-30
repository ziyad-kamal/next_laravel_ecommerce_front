interface DropzoneProps<T = object> {
    className?: string;
    setInputs: React.Dispatch<
        React.SetStateAction<{
            items: Array<T>;
            images: { originalName: string; path: string }[];
        }>
    >;
}

export default DropzoneProps;
