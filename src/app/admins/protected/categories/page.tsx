"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import sendRequest from "@/functions/sendRequest";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { display } from "@/redux/DisplayToast";
import { Button } from "@/components";
import Table from "@/components/Table";
import ReactPaginate from "react-paginate";
import Modal from "@/components/Modal";
import { displayModal } from "@/redux/DisplayModal";
import LocaleState from "@/interfaces/states/LocaleState";
import CategoryState from "@/interfaces/states/CategoryState";
import Image from "next/image";

const DeleteConfirmationModal = memo(
    ({ onConfirm }: { onConfirm: () => void }) => (
        <Modal
            title="delete user"
            handleClick={onConfirm}
        >
            <p>Are you want to delete this user</p>
        </Modal>
    )
);
DeleteConfirmationModal.displayName = "DeleteConfirmationModal";

const GetCategories = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = useRef<number>(0);
    const localeState = useAppSelector(
        (state: { setLocale: LocaleState }) => state.setLocale
    );
    const abortController = useRef<AbortController | null>(null);
    const abortControllerForDelete = useRef<AbortController | null>(null);

    const [categories, setCategories] = useState<CategoryState[]>([
        {
            id: 0,
            name: "",
            image: "",
            trans_lang: "",
            created_at: "",
        },
    ]);

    const [sortConfig, setSortConfig] = useState<{
        keyToSort: string; // 'name', 'email', or 'created_at'
        direction: string;
    }>({ keyToSort: "name", direction: "asc" });

    //MARK:HeaderClick
    const handleHeaderClick = (header: string) => {
        if (header !== "action") {
            setSortConfig((prev) => ({
                keyToSort: header,
                direction:
                    prev.keyToSort === header && prev.direction === "asc"
                        ? "desc"
                        : "asc",
            }));
        }
    };

    const [metaData, setMetaData] = useState<{
        totalPages: number;
        currentPage: number;
    }>({ totalPages: 0, currentPage: 1 });

    //MARK:get categories
    useEffect(() => {
        const url = `/admin-panel/category?keyToSort=${sortConfig.keyToSort}&direction=${sortConfig.direction}`;
        const abortController = new AbortController();
        const token = localStorage.getItem("adminToken");

        const fetchData = async () => {
            const response = await sendRequest(
                "get",
                url,
                null,
                abortController,
                token,
                router
            );

            if (response && response.success) {
                setCategories(response.data.data);
                setMetaData({
                    ...metaData,
                    totalPages: response.data.meta.total,
                });
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
            }
        };

        fetchData();

        return () => abortController.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, router, localeState.locale, sortConfig]);

    //MARK:actions
    const handleEdit = (id: number) => {
        router.push(`/admins/protected/categories/${id}`);
    };

    const handleAdd = () => {
        router.push(`/admins/protected/categories/store`);
    };

    const handleDelete = (categoryId: number) => {
        id.current = categoryId;
        dispatch(displayModal({ isVisible: true, type: "confirm" }));
    };

    //MARK:handleConfirm
    const handleConfirm = useCallback(() => {
        const url = `/admin-panel/category/${id.current}`;
        const token = localStorage.getItem("adminToken");

        if (abortControllerForDelete.current) {
            abortControllerForDelete.current.abort();
        }
        abortControllerForDelete.current = new AbortController();

        const deleteData = async () => {
            dispatch(displayModal({ disable: true }));

            const response = await sendRequest(
                "delete",
                url,
                null,
                abortController.current,
                token,
                router
            );
            if (response && response.success) {
                const newCategories = categories.filter((category) => {
                    return category.id !== id.current;
                });

                setCategories(newCategories);
                dispatch(
                    display({ type: "success", message: response.msg.text })
                );
                dispatch(displayModal({ disable: false }));
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
                dispatch(displayModal({ disable: false }));
            }
        };

        deleteData();
    }, [categories, dispatch, router]);

    //MARK:PageChange
    const handlePageChange = ({ selected }: { selected: number }) => {
        const page = selected + 1;
        const url = `/admin-panel/category?page=${page}&keyToSort=${sortConfig.keyToSort}&direction=${sortConfig.direction}`;
        const token = localStorage.getItem("adminToken");

        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();

        const fetchData = async () => {
            const response = await sendRequest(
                "get",
                url,
                null,
                abortController.current,
                token,
                router
            );
            if (response && response.success) {
                setCategories(response.data.data);
                setMetaData({ ...metaData, currentPage: page });
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
            }
        };

        fetchData();
    };

    //MARK:categoriesRow
    const categoriesRow = categories.map((category) => {
        return (
            <tr
                key={category.id}
                className="hover:bg-gray-200"
            >
                <td className="row_table">{category.name}</td>

                <td className="row_table">{category.trans_lang}</td>
                <td className="row_table">
                    {category.image && (
                        <Image
                            priority={metaData.currentPage === 1}
                            alt="loading"
                            src={category.image}
                            width="0"
                            height="0"
                            sizes="100vw"
                            style={{ width: "100px", height: "auto" }}
                        />
                    )}
                </td>
                <td className="row_table">{category.created_at}</td>
                <td className="row_table">
                    <Button
                        classes={"bg-indigo-600 hover:bg-indigo-700 text-white"}
                        text={`Edit`}
                        type="button"
                        icon={Edit}
                        handleClick={() => handleEdit(category.id)}
                    />
                    <Button
                        classes={"bg-red-600 hover:bg-red-700 text-white"}
                        text={`delete`}
                        type="button"
                        icon={Trash2}
                        handleClick={() => handleDelete(category.id)}
                    />
                </td>
            </tr>
        );
    });

    return (
        <>
            <DeleteConfirmationModal onConfirm={handleConfirm} />

            <Table
                title={"categories"}
                classes={"bg-white"}
                tableHeaders={[
                    "name",
                    "language",
                    "image",
                    "created_at",
                    "action",
                ]}
                handleBtnClick={() => handleAdd()}
                sortConfig={sortConfig}
                handleHeaderClick={handleHeaderClick}
                records={categories}
            >
                {categoriesRow}
            </Table>

            <div className="flex justify-center">
                <ReactPaginate
                    pageCount={metaData.totalPages}
                    onPageChange={handlePageChange}
                    pageRangeDisplayed={6}
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    containerClassName="inline-flex flex justify-center -space-x-px text-sm my-5"
                    pageClassName="flex items-center justify-center cursor-pointer"
                    pageLinkClassName="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    activeClassName="active"
                    activeLinkClassName="active_link"
                    previousClassName={`flex items-center justify-center ${
                        metaData.currentPage !== 1 ? "cursor-pointer" : null
                    }`}
                    nextClassName="flex items-center justify-center cursor-pointer"
                    previousLinkClassName="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    nextLinkClassName="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    breakClassName="flex items-center justify-center cursor-pointer"
                    breakLinkClassName="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300"
                    disabledClassName="opacity-50 cursor-not-allowed"
                />
            </div>
        </>
    );
};

export default GetCategories;
