import SelectInputProps from "@/interfaces/props/SelectInputProps";

const SelectInput: React.FC<SelectInputProps> = ({
    options,
    placeholder = "Select an option",
    value,
    handleChange,
    disabled = false,
    error,
    label,
    className = "",
    name,
}) => {
    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            {label && (
                <label
                    className="block text-lg leading-none mb-2 mt-4"
                    htmlFor={name}
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={(e) => handleChange?.(e, name)}
                    disabled={disabled}
                    className={`
            w-full px-3 py-2 border rounded-lg shadow-sm appearance-none bg-white
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
            ${
                error
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
            }
            ${disabled ? "bg-gray-100" : "hover:border-gray-400"}
        `}
                >
                    <option
                        value=""
                        disabled
                    >
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                        className={`w-4 h-4 ${
                            disabled ? "text-gray-400" : "text-gray-500"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>

            {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
    );
};

export default SelectInput;
