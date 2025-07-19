import ButtonProps from "@/interfaces/ButtonProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";

const Button = ({
    handleClick,
    text,
    classes = "bg-green-700  hover:bg-green-800 text-white",
    type = "submit",
    icon,
    children,
    disable,
}: ButtonProps) => {
    return (
        <>
            <button
                className={` text-sm font-bold inline-flex text-center  mx-1
                    px-3 py-2 w-auto rounded-lg cursor-pointer ${classes}`}
                type={type}
                onClick={handleClick}
                disabled={disable}
            >
                {icon && (
                    <FontAwesomeIcon
                        className="text-white mx-1"
                        icon={icon}
                    />
                )}

                {text}
                {children}
            </button>
        </>
    );
};

export default memo(Button);
