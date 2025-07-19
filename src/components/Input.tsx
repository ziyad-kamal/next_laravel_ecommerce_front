import InputProps from "@/interfaces/InputProps";

const Input = ({
    name,
    classes = "focus:shadow-blue-500 focus:border-blue-500 bg-white",
    type = "text",
    isRequired = true,
    handleChange,
    placeholder,
    inputRef,
    error = "",
}: InputProps) => {
    return (
        <>
            <input
                className={`block w-full pl-10 pr-3 py-3 border
                        rounded-lg focus:outline-none focus:ring-2
                        focus:border-transparent 
                        "${classes}
                        `}
                type={type}
                name={name}
                placeholder={placeholder ?? `enter your ${name}`}
                required={isRequired}
                id={name}
                autoComplete="true"
                ref={inputRef}
                onChange={(e) => handleChange(e, name)}
            />
            {error ? (
                <p className="text-red-500 font-bold mb-1">{error}</p>
            ) : null}
        </>
    );
};

export default Input;
