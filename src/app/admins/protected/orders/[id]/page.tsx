"use client";

import { Button, SelectInput } from "@/components";
import sendRequest from "@/functions/sendRequest";
import Option from "@/interfaces/props/Option";
import OrderDetailsState from "@/interfaces/states/OrderDetailsState";
import { useAppDispatch } from "@/lib/hooks";
import { display } from "@/redux/DisplayToast";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

const OrderDetailsPage = ({ params }: { params: Promise<{ id: number }> }) => {
    type OrderStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(1);
    const stateOptions: Option[] = [
        { value: 1, label: "pending" },
        { value: 2, label: "processing" },
        { value: 3, label: "shipped" },
        { value: 4, label: "delivered" },
        { value: 5, label: "cancelled" },
        { value: 6, label: "pending to refund" },
        { value: 7, label: "refunding" },
        { value: 8, label: "refunded" },
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
        method: "",
        user: {
            name: "",
            email: "",
            user_infos: {
                address: "",
                card_num: "",
                card_type: "",
                phone: null,
            },
        },

        date_of_delivery: "",
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
                    pendingToRefund: 6,
                    refunding: 7,
                    refunded: 8,
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

    const handleClickUpdate = (state: number | null = null) => {
        setIsLoading(true);

        if (state == null) {
            state = orderStatus;

            if (orderStatus == 8) {
                handleClickRefund();
                return;
            }

            if (orderStatus == 4) {
                handleClickDelivery();
                return;
            }
        }

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
                { state: state },
                abortController.current,
                token,
                router
            );

            if (response && response.success) {
                dispatch(
                    display({ type: "success", message: response.msg.text })
                );
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
            }
        };

        submitData();
        setIsLoading(false);
    };

    const handleClickDelivery = () => {
        setIsLoading(true);

        const token = localStorage.getItem("adminToken");
        const url = `/admin-panel/order/delivery/${id}?_method=put`;

        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();

        const submitData = async () => {
            const response = await sendRequest(
                "post",
                url,
                {},
                abortController.current,
                token,
                router
            );

            if (response && response.success) {
                dispatch(
                    display({ type: "success", message: response.msg.text })
                );
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
            }
        };

        submitData();
        setIsLoading(false);
    };

    const handleClickRefund = () => {
        setIsLoading(true);

        const token = localStorage.getItem("adminToken");
        const url = `/admin-panel/order/refund/${id}?_method=put`;

        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();

        const submitData = async () => {
            const response = await sendRequest(
                "post",
                url,
                {},
                abortController.current,
                token,
                router
            );

            if (response && response.success) {
                dispatch(
                    display({ type: "success", message: response.msg.text })
                );
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
            }
        };

        submitData();
        setIsLoading(false);
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
                                {order.date_of_delivery}
                            </p>
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
                                    handleClick={() => handleClickUpdate()}
                                />
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Order Items
                            </h2>
                            <div className="space-y-4">
                                {order.items
                                    ? order.items.map((item) => (
                                          <div
                                              key={item.id}
                                              className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                                          >
                                              <div className="relative w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                  {item.images &&
                                                  item.images[0] ? (
                                                      <Image
                                                          src={
                                                              item.images[0]
                                                                  .path
                                                          }
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
                                                  {/* <p className="text-sm text-gray-600">
                                                Qty: {order.quantity}
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                ${item.price * order.quantity}
                                            </p> */}
                                              </div>
                                          </div>
                                      ))
                                    : null}
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
                                {
                                    <div className="text-gray-700 space-y-1">
                                        <p>
                                            {order.user?.user_infos
                                                ? order.user.user_infos.address
                                                : null}
                                        </p>
                                    </div>
                                }
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
                            {
                                <>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {order.user?.name}
                                            </h3>
                                            <button className="text-sm text-blue-600 hover:underline">
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <FontAwesomeIcon
                                                icon={faEnvelope}
                                                className="text-primary-color"
                                            />
                                            <span className="text-sm">
                                                {order.user?.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <FontAwesomeIcon
                                                icon={faPhone}
                                                className="text-primary-color"
                                            />
                                            <span className="text-sm">
                                                {order.user?.user_infos
                                                    ? order.user.user_infos
                                                          .phone
                                                    : null}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>

                        {/* Payment Info */}
                        {
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4">
                                    Payment Information
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Method
                                        </span>
                                        <span className="font-medium">
                                            {order.method}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Card Type
                                        </span>
                                        <span className="font-medium">
                                            {order.user?.user_infos
                                                ? order.user.user_infos
                                                      .card_type
                                                : null}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Card Number
                                        </span>
                                        <span className="font-medium">
                                            ••••{" "}
                                            {order.user?.user_infos
                                                ? order.user.user_infos.card_num.match(
                                                      /(\d{4})[^"]*"/
                                                  )
                                                : null?.[1] || "••••"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        }

                        {/* Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Actions
                            </h2>
                            <div className="space-y-3">
                                <Button
                                    text="process to refund"
                                    isLoading={isLoading}
                                    handleClick={() => handleClickRefund()}
                                    classes="bg-gray-500 hover:bg-gray-600 w-full"
                                />
                                <Button
                                    text="cancel"
                                    isLoading={isLoading}
                                    handleClick={() => handleClickUpdate(5)}
                                    classes="bg-red-700 hover:bg-red-800 w-full "
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
