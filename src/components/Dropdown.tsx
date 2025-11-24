import DropdownProps from "@/interfaces/props/DropdownProps";

const Dropdown = ({
    items,
    onSelect,
    show,
    langIndex,
    type,
    ref,
}: DropdownProps) => {
    if (!show || items.length === 0) return null;

    return (
        <div
            ref={(el) => {
                if (type === "category") {
                    ref.current[langIndex] = el;
                } else {
                    ref.current[langIndex] = el;
                }
            }}
            className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
            {items.map((item, index) => (
                <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                    onClick={() => onSelect(item)}
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
};

export default Dropdown;
