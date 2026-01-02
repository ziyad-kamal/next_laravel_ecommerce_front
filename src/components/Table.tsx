import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import Button from "./Button";
import TableProps from "@/interfaces/props/TableProps";

export default function Table({
    title,
    classes = "bg-white",
    tableHeaders = [],
    children,
    handleBtnClick,
    sortConfig,
    handleHeaderClick,
}: TableProps) {
    const headersList = tableHeaders.map((header, i) => {
        return (
            <th
                key={i}
                className="text-left cursor-pointer py-3 px-3 text-sm font-medium text-gray-900"
                onClick={() => handleHeaderClick(header)}
            >
                {header}

                {sortConfig.keyToSort === header &&
                sortConfig.keyToSort !== "action" ? (
                    sortConfig.direction === "asc" ? (
                        <ArrowUp className="mx-1 inline w-4 h-4" />
                    ) : (
                        <ArrowDown className="mx-1 inline w-4 h-4" />
                    )
                ) : null}
            </th>
        );
    });

    return (
        <>
            <div
                className={`max-w-6xl mx-auto rounded-lg shadow-sm border
                    border-gray-200 p-6 ${classes} mt-4`}
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 mb-2">
                            {title}
                        </h1>
                    </div>

                    <Button
                        classes={"bg-indigo-600 hover:bg-indigo-700 text-white"}
                        text={`Add`}
                        icon={Plus}
                        handleClick={handleBtnClick}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                {headersList}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {children}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
