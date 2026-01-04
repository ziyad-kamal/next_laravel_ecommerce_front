"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import sendRequest from "@/functions/sendRequest";
import { useAppDispatch } from "@/lib/hooks";
import { display } from "@/redux/DisplayToast";
import AdminState from "@/interfaces/states/AdminState";
import { Button } from "@/components";
import Table from "@/components/Table";
import ReactPaginate from "react-paginate";
import Modal from "@/components/Modal";
import { displayModal } from "@/redux/DisplayModal";

const DeleteConfirmationModal = memo(
    ({
        onConfirm,
        t,
    }: {
        onConfirm: () => void;
        t: ReturnType<typeof useTranslations>;
    }) => (
        <Modal
            title={t("modal.deleteUser")}
            handleClick={onConfirm}
        >
            <p>{t("modal.confirmDeleteUser")}</p>
        </Modal>
    )
);
DeleteConfirmationModal.displayName = "DeleteConfirmationModal";

const GetUsers = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const t = useTranslations("users");
    const tTable = useTranslations("table");
    const tButtons = useTranslations("buttons");
    const id = useRef<number>(0);
    const abortController = useRef<AbortController | null>(null);
    const abortControllerForDelete = useRef<AbortController | null>(null);

    const [users, setUsers] = useState<AdminState[]>([
        {
            id: 0,
            name: "",
            email: "",
            created_at: "",
        },
    ]);

    const [sortConfig, setSortConfig] = useState<{
        keyToSort: string;
        direction: string;
    }>({ keyToSort: "name", direction: "asc" });

    //MARK:handleHeaderClick
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

    //MARK:get users
    useEffect(() => {
        const url = `/admin-panel/user?keyToSort=${sortConfig.keyToSort}&direction=${sortConfig.direction}`;
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
                setUsers(response.data.data);
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
    }, [dispatch, router, sortConfig]);

    //MARK:actions
    const handleEdit = (id: number) => {
        router.push(`/admins/protected/users/${id}`);
    };

    const handleAdd = () => {
        router.push(`/admins/protected/users/store`);
    };

    const handleDelete = (userId: number) => {
        id.current = userId;
        dispatch(displayModal({ isVisible: true, type: "confirm" }));
    };

    //MARK:handleConfirm
    const handleConfirm = useCallback(() => {
        const url = `/admin-panel/user/${id.current}`;
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
                abortControllerForDelete.current,
                token,
                router
            );
            if (response && response.success) {
                setUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== id.current)
                );

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
    }, [dispatch, router]);

    //MARK:PageChange
    const handlePageChange = ({ selected }: { selected: number }) => {
        const page = selected + 1;
        const url = `/admin-panel/user?page=${page}&keyToSort=${sortConfig.keyToSort}&direction=${sortConfig.direction}`;
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
                setUsers(response.data.data);
                setMetaData({ ...metaData, currentPage: page });
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
            }
        };

        fetchData();
    };

    //MARK:usersRow
    const usersRow = users.map((user) => {
        return (
            <tr
                key={user.id}
                className="hover:bg-gray-200"
            >
                <td className="row_table">{user.name}</td>

                <td className="row_table">{user.email}</td>
                <td className="row_table">{user.created_at}</td>
                <td className="row_table">
                    <Button
                        classes={"bg-indigo-600 hover:bg-indigo-700 text-white"}
                        text={tButtons("edit")}
                        type="button"
                        icon={Edit}
                        handleClick={() => handleEdit(user.id)}
                    />
                    <Button
                        classes={"bg-red-600 hover:bg-red-700 text-white"}
                        text={tButtons("delete")}
                        type="button"
                        icon={Trash2}
                        handleClick={() => handleDelete(user.id)}
                    />
                </td>
            </tr>
        );
    });

    return (
        <>
            <DeleteConfirmationModal
                onConfirm={handleConfirm}
                t={t}
            />

            <Table
                title={t("title")}
                classes={"bg-white"}
                tableHeaders={[
                    tTable("name"),
                    tTable("email"),
                    tTable("createdAt"),
                    tTable("action"),
                ]}
                handleBtnClick={() => handleAdd()}
                sortConfig={sortConfig}
                handleHeaderClick={handleHeaderClick}
                records={users}
            >
                {usersRow}
            </Table>

            <div className="flex justify-center">
                <ReactPaginate
                    pageCount={metaData.totalPages}
                    onPageChange={handlePageChange}
                    pageRangeDisplayed={6}
                    previousLabel={tTable("previous")}
                    nextLabel={tTable("next")}
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

export default GetUsers;
