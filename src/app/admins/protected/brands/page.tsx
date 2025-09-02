"use client";

import { useEffect, useRef, useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import sendRequest from "@/functions/sendRequest";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { display } from "@/redux/DisplayToast";
import BrandState from "@/interfaces/states/BrandState";
import { Button } from "@/components";
import Table from "@/components/Table";
import ReactPaginate from "react-paginate";
import Modal from "@/components/Modal";
import { displayModal } from "@/redux/DisplayModal";
import LocaleState from "@/interfaces/states/LocaleState";

const GetBrands = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = useRef<number>(0);
    const localeState = useAppSelector(
        (state: { setLocale: LocaleState }) => state.setLocale
    );

    const [brands, setBrands] = useState<BrandState[]>([
        {
            id: 0,
            name: "",
            trans_lang: "",
            created_at: "",
        },
    ]);

    const [sortConfig, setSortConfig] = useState<{
        keyToSort: string; // 'name', 'email', or 'created_at'
        direction: string;
    }>({ keyToSort: "name", direction: "asc" });

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

    const getSortedBrands = (brands: BrandState[]) => {
        const key = sortConfig.keyToSort as keyof BrandState;
        if (sortConfig.direction === "asc") {
            return brands.sort((a, b) => (a[key] > b[key] ? 1 : -1));
        }

        return brands.sort((a, b) => (a[key] > b[key] ? -1 : 1));
    };

    const [metaData, setMetaData] = useState<{
        totalPages: number;
        currentPage: number;
    }>({ totalPages: 0, currentPage: 1 });

    useEffect(() => {
        const url = `/admin-panel/brand?keyToSort=${sortConfig.keyToSort}&direction=${sortConfig.direction}`;
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
                setBrands(response.data.data);
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
    }, [dispatch, router, localeState.locale]);

    const handleEdit = (id: number) => {
        router.push(`/admins/protected/brands/${id}`);
    };

    const handleAdd = () => {
        router.push(`/admins/protected/brands/store`);
    };

    const handleConfirm = () => {
        const url = `/admin-panel/brand/${id.current}`;
        const abortController = new AbortController();
        const token = localStorage.getItem("adminToken");

        const deleteData = async () => {
            dispatch(displayModal({ disable: true }));

            const response = await sendRequest(
                "delete",
                url,
                null,
                abortController,
                token,
                router
            );
            if (response && response.success) {
                const newBrands = brands.filter((brand) => {
                    return brand.id !== id.current;
                });

                setBrands(newBrands);
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
    };

    const handleDelete = (adminId: number) => {
        id.current = adminId;
        dispatch(displayModal({ isVisible: true, type: "confirm" }));
    };

    let abortControllerForPages: AbortController | null = null;

    const handlePageChange = ({ selected }: { selected: number }) => {
        const page = selected + 1;
        const url = `/admin-panel/brand?page=${page}&keyToSort=${sortConfig.keyToSort}&direction=${sortConfig.direction}`;
        const token = localStorage.getItem("adminToken");

        if (abortControllerForPages) {
            abortControllerForPages.abort();
        }
        abortControllerForPages = new AbortController();

        const fetchData = async () => {
            const response = await sendRequest(
                "get",
                url,
                null,
                abortControllerForPages,
                token,
                router
            );
            if (response && response.success) {
                setBrands(response.data.data);
                setMetaData({ ...metaData, currentPage: page });
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
            }
        };

        fetchData();
    };

    const adminsRow = getSortedBrands(brands).map((brand) => {
        return (
            <tr
                key={brand.id}
                className="hover:bg-gray-200"
            >
                <td className="row_table">{brand.name}</td>

                <td className="row_table">{brand.trans_lang}</td>
                <td className="row_table">{brand.created_at}</td>
                <td className="row_table">
                    <Button
                        classes={"bg-indigo-600 hover:bg-indigo-700 text-white"}
                        text={`Edit`}
                        type="button"
                        icon={faEdit}
                        handleClick={() => handleEdit(brand.id)}
                    />
                    <Button
                        classes={"bg-red-600 hover:bg-red-700 text-white"}
                        text={`delete`}
                        type="button"
                        icon={faTrash}
                        handleClick={() => handleDelete(brand.id)}
                    />
                </td>
            </tr>
        );
    });

    return (
        <>
            <Modal
                title="delete brand"
                handleClick={handleConfirm}
            >
                <p>Are you want to delete this brand</p>
            </Modal>

            <Table
                title={"brands"}
                classes={"bg-white"}
                tableHeaders={["name", "language", "created_at", "action"]}
                handleBtnClick={() => handleAdd()}
                sortConfig={sortConfig}
                handleHeaderClick={handleHeaderClick}
                records={brands}
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

export default GetBrands;
