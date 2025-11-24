import ButtonProps from "@/interfaces/props/ButtonProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";

const Button = ({
    handleClick,
    text,
    classes = "bg-green-700  hover:bg-green-800 text-white",
    type = "submit",
    icon,
    isLoading = false,
}: ButtonProps) => {
    return (
        <>
            <button
                className={`text-sm font-bold inline-flex text-center  mx-1
                    px-3 py-2 w-auto rounded-lg cursor-pointer ${classes}`}
                type={type}
                onClick={handleClick}
                disabled={isLoading}
            >
                {icon && (
                    <FontAwesomeIcon
                        className="text-white mx-1"
                        icon={icon}
                    />
                )}

                {isLoading ? (
                    <div className="flex text-white items-center">
                        <div className="animate-spin   rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {text + "ing ..."}
                    </div>
                ) : (
                    <div className="flex text-white items-center">{text}</div>
                )}
            </button>
        </>
    );
};

export default memo(Button);
