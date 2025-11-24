"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import sendRequest from "@/functions/sendRequest";
import { useAppDispatch } from "@/lib/hooks";
import { display } from "@/redux/DisplayToast";
import { Button } from "@/components";
import Table from "@/components/Table";
import ReactPaginate from "react-paginate";
import Modal from "@/components/Modal";
import { displayModal } from "@/redux/DisplayModal";
import OrderState from "@/interfaces/states/OrderState";

const DeleteConfirmationModal = memo(
    ({ onConfirm }: { onConfirm: () => void }) => (
        <Modal
            title="delete order"
            handleClick={onConfirm}
        >
            <p>Are you want to delete this order</p>
        </Modal>
    )
);
DeleteConfirmationModal.displayName = "DeleteConfirmationModal";

const GetOrders = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = useRef<number>(0);
    const abortController = useRef<AbortController | null>(null);
    const abortControllerForDelete = useRef<AbortController | null>(null);

    const [orders, setOrders] = useState<OrderState[]>([
        {
            id: 0,
            user_name: "",
            total_amount: 0,
            state: "",
            created_at: "",
        },
    ]);

    const [sortConfig, setSortConfig] = useState<{
        keyToSort: string;
        direction: string;
    }>({ keyToSort: "created_at", direction: "desc" });

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

    // const getSortedAdmins = (orders: AdminState[]) => {
    //     const key = sortConfig.keyToSort as keyof AdminState;
    //     if (sortConfig.direction === "asc") {
    //         return orders.sort((a, b) => (a[key] > b[key] ? 1 : -1));
    //     }

    //     return orders.sort((a, b) => (a[key] > b[key] ? -1 : 1));
    // };

    const [metaData, setMetaData] = useState<{
        totalPages: number;
        currentPage: number;
    }>({ totalPages: 0, currentPage: 1 });

    //MARK:get orders
    useEffect(() => {
        const url = `/admin-panel/order?keyToSort=${sortConfig.keyToSort}&direction=${sortConfig.direction}`;
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
                setOrders(response.data.data);
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
        router.push(`/admins/protected/orders/${id}`);
    };

    const handleAdd = () => {
        router.push(`/admins/protected/orders/store`);
    };

    const handleDelete = (adminId: number) => {
        id.current = adminId;
        dispatch(displayModal({ isVisible: true, type: "confirm" }));
    };

    //MARK:handleConfirm
    const handleConfirm = useCallback(() => {
        const url = `/admin-panel/order/${id.current}`;
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
                const newOrders = orders.filter((order) => {
                    return order.id !== id.current;
                });

                setOrders(newOrders);
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
    }, [orders, dispatch, router]);

    //MARK:handlePageChange
    const handlePageChange = ({ selected }: { selected: number }) => {
        const page = selected + 1;
        const url = `/admin-panel/order?page=${page}&keyToSort=${sortConfig.keyToSort}&direction=${sortConfig.direction}`;
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
                setOrders(response.data.data);
                setMetaData({ ...metaData, currentPage: page });
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
            }
        };

        fetchData();
    };

    //MARK:adminsRow
    const adminsRow = orders.map((order) => {
        return (
            <tr
                key={order.id}
                className="hover:bg-gray-200"
            >
                <td className="row_table">${order.total_amount}</td>
                <td className="row_table">{order.state}</td>
                <td className="row_table">{order.user_name}</td>
                <td className="row_table">{order.created_at}</td>
                <td className="row_table">
                    <Button
                        classes={"bg-indigo-600 hover:bg-indigo-700 text-white"}
                        text={`Edit`}
                        type="button"
                        icon={faEdit}
                        handleClick={() => handleEdit(order.id)}
                    />
                    <Button
                        classes={"bg-red-600 hover:bg-red-700 text-white"}
                        text={`delete`}
                        type="button"
                        icon={faTrash}
                        handleClick={() => handleDelete(order.id)}
                    />
                </td>
            </tr>
        );
    });

    return (
        <>
            <DeleteConfirmationModal onConfirm={handleConfirm} />

            <Modal
                title="delete order"
                handleClick={handleConfirm}
            >
                <p>Are you want to delete this order</p>
            </Modal>

            <Table
                title={"orders"}
                classes={"bg-white"}
                tableHeaders={[
                    "total_amount",
                    "state",
                    "name",
                    "created_at",
                    "action",
                ]}
                handleBtnClick={() => handleAdd()}
                sortConfig={sortConfig}
                handleHeaderClick={handleHeaderClick}
                records={orders}
            >
                {adminsRow}
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

export default GetOrders;
