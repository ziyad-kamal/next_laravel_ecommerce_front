"use client";

import { Button, SelectInput } from "@/components";
import sendRequest from "@/functions/sendRequest";
import Option from "@/interfaces/props/Option";
import OrderDetailsState from "@/interfaces/states/OrderDetailsState";
import { useAppDispatch } from "@/lib/hooks";
import { display } from "@/redux/DisplayToast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

const OrderDetailsPage = ({ params }: { params: Promise<{ id: number }> }) => {
    type OrderStatus = 1 | 2 | 3 | 4 | 5;
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(1);
    const stateOptions: Option[] = [
        { value: 1, label: "pending" },
        { value: 2, label: "processing" },
        { value: 3, label: "shipped" },
        { value: 4, label: "delivered" },
        { value: 5, label: "cancelled" },
    ];
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const abortController = useRef<AbortController | null>(null);
    const dispatch = useAppDispatch();

    const router = useRouter();
    const { id } = React.use(params);

    const [order, setOrder] = useState<OrderDetailsState>({
        id: 0,
        total_amount: 0,
        state: "",
        quantity: 0,
        user_name: "",
        created_at: "",
        items: [],
    });

    useEffect(() => {
        const url = `/admin-panel/order/${id}`;
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
                setOrder(response.data.order);
                // Map state string to numeric value
                const stateMap: { [key: string]: OrderStatus } = {
                    pending: 1,
                    processing: 2,
                    shipped: 3,
                    delivered: 4,
                    cancelled: 5,
                };
                setOrderStatus(stateMap[response.data.order.state] || 1);
            }
        };

        fetchData();

        return () => abortController.abort();
    }, [router, id]);

    const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setOrderStatus(Number(e.target.value) as OrderStatus);
    };

    const handleClickUpdate = () => {
        setIsLoading(true);

        const token = localStorage.getItem("adminToken");
        const url = `/admin-panel/order/${id}?_method=put`;

        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();

        const submitData = async () => {
            const response = await sendRequest(
                "post",
                url,
                { state: orderStatus },
                abortController.current,
                token,
                router
            );

            if (response && response.success) {
                dispatch(
                    display({ type: "success", message: response.msg.text })
                );

                setIsLoading(false);
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
                setIsLoading(false);
            }
        };

        submitData();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                        <i className="fas fa-home"></i>
                        <span>/</span>
                        <span>Orders</span>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">
                            Order Details
                        </span>
                    </div>

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Order #{order.id}
                            </h1>
                            <p className="text-gray-600">
                                <i className="far fa-clock mr-2"></i>
                                {order.created_at}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                <i className="fas fa-print mr-2"></i>
                                Print
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                <i className="fas fa-download mr-2"></i>
                                Invoice
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Order Status
                            </h2>
                            <div className="flex items-center gap-4">
                                <SelectInput
                                    label="state"
                                    options={stateOptions}
                                    placeholder="Pick a state"
                                    value={orderStatus}
                                    handleChange={(e) => handleInputChange(e)}
                                    name="state"
                                    className="mb-10 w-70"
                                />

                                <Button
                                    text="update state"
                                    isLoading={isLoading}
                                    handleClick={handleClickUpdate}
                                />
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Order Items
                            </h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                                    >
                                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {item.images && item.images[0] ? (
                                                <Image
                                                    src={item.images[0].path}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain p-1"
                                                    sizes="64px"
                                                    unoptimized
                                                />
                                            ) : (
                                                <i className="fas fa-image text-gray-400 text-2xl"></i>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                usa: {item.price}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">
                                                Qty: {order.quantity}
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                ${item.price * order.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-6 pt-6 border-t space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${order.total_amount}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>$5</span>
                                </div>

                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                                    <span>Total</span>
                                    <span>${order.total_amount + 5}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping & Billing Addresses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center">
                                    <i className="fas fa-truck mr-2 text-blue-600"></i>
                                    Shipping Address
                                </h2>
                                {/* <div className="text-gray-700 space-y-1">
                                    <p>{order.shippingAddress.street}</p>
                                    <p>
                                        {order.shippingAddress.city},{" "}
                                        {order.shippingAddress.state}{" "}
                                    </p>
                                    <p>{order.shippingAddress.country}</p>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Customer Information
                            </h2>
                            {/* <div className="flex items-center gap-3 mb-4">
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        {order.customer.name}
                                    </h3>
                                    <button className="text-sm text-blue-600 hover:underline">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <i className="fas fa-envelope w-5 text-gray-400"></i>
                                    <span className="text-sm">
                                        {order.customer.email}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <i className="fas fa-phone w-5 text-gray-400"></i>
                                    <span className="text-sm">
                                        {order.customer.phone}
                                    </span>
                                </div>
                            </div> */}
                        </div>

                        {/* Payment Info */}
                        {/* <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Payment Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Method
                                    </span>
                                    <span className="font-medium">
                                        {order.payment.method}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Card Type
                                    </span>
                                    <span className="font-medium">
                                        {order.payment.cardType}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Card Number
                                    </span>
                                    <span className="font-medium">
                                        •••• {order.payment.last4}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t">
                                    <span className="text-gray-600">
                                        Status
                                    </span>
                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        <i className="fas fa-check-circle mr-1"></i>
                                        {order.payment.status}
                                    </span>
                                </div>
                            </div>
                        </div> */}

                        {/* Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Actions
                            </h2>
                            <div className="space-y-3">
                                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    <i className="fas fa-envelope mr-2"></i>
                                    Send Email to Customer
                                </button>
                                <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                                    <i className="fas fa-redo mr-2"></i>
                                    Process Refund
                                </button>
                                <button className="w-full px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
                                    <i className="fas fa-times-circle mr-2"></i>
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
