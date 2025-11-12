interface DropzoneProps<T = object> {
    className?: string;
    setInputs: React.Dispatch<
        React.SetStateAction<{
            items: Array<T>;
            images: { originalName: string; path: string; preview: string }[];
        }>
    >;
    inputs: {
        items: Array<T>;
        images: { originalName: string; path: string; preview: string }[];
    };
    uploadedFiles?: string[];
}

export default DropzoneProps;
