import { SuggestionItem } from "../states/SuggestionItem";

interface DropdownProps {
    items: SuggestionItem[];
    onSelect: (item: SuggestionItem) => void;
    show: boolean;
    langIndex: number;
    type: "category" | "brand";
    ref: React.RefObject<{
        [key: number]: HTMLDivElement | null;
    }>;
}

export default DropdownProps;
