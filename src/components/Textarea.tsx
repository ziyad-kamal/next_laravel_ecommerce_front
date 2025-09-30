import TextareaProps from "@/interfaces/props/TextareaProps";

const Textarea = ({
    label,
    name,
    classes = "focus:shadow-blue-500 focus:border-blue-500 bg-white",
    isRequired = true,
    handleChange,
    placeholder,
    value,
    inputRef,
    error = "",
    cols,
    rows,
}: TextareaProps) => {
    return (
        <>
            {label ? (
                <label
                    htmlFor={name}
                    className="block text-lg leading-none mb-2 mt-4"
                >
                    {label}
                </label>
            ) : null}

            <textarea
                cols={cols}
                rows={rows}
                className={`block w-full pl-10 pr-3 py-3 border 
                        rounded-lg focus:outline-none focus:ring-3
                        focus:border-transparent 
                        "${classes} 
                        `}
                name={name}
                placeholder={placeholder ?? `enter your ${name}`}
                required={isRequired}
                id={name}
                autoComplete="true"
                ref={inputRef}
                onChange={(e) => handleChange(e, name)}
                value={value}
            />
            {error ? (
                <p className="text-red-500 font-bold mb-1">{error}</p>
            ) : null}
        </>
    );
};

export default Textarea;
