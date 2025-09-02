import { MouseEvent } from "react";

interface TableProps {
    title: string;
    classes?: string;
    tableHeaders?: string[];
    children: React.ReactNode;
    handleBtnClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    sortConfig: { keyToSort: string; direction: string };
    handleHeaderClick: (key: string) => void;
    records: object[];
}

export default TableProps;
