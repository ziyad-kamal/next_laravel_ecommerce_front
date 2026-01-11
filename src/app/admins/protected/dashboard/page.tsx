"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart, DollarSign, Users, Package } from "lucide-react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import sendRequest from "@/functions/sendRequest";
import { useRouter } from "next/navigation";
import OrderDetailsState from "@/interfaces/states/OrderDetailsState";
import { StatCard } from "@/components";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/lib/hooks";
import LocaleState from "@/interfaces/states/LocaleState";

const Dashboard: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("6");
    const router = useRouter();
    const t = useTranslations("dashboard");
    const localeState = useAppSelector(
        (state: { setLocale: LocaleState }) => state.setLocale
    );
    const isRTL = localeState.locale === "ar" ? true : false; // Adjust based on your RTL languages

    const tTable = useTranslations("table");
    const [stats, setStats] = useState([
        {
            title: "Total sales",
            value: "",
            change: 0,
            icon: <DollarSign className="w-6 h-6 text-white" />,
        },
    ]);
    const [salesData, setSalesData] = useState([
        { name: "", sales: 0, orders: 0 },
    ]);
    const [categoryData, setCategoryData] = useState([
        { name: "", value: 0, color: "" },
    ]);
    const [trafficData, setTrafficData] = useState([
        { day: "", visits: 0, conversions: 0 },
    ]);

    const [recentOrders, setRecentOrders] = useState<OrderDetailsState[]>([]);

    useEffect(() => {
        const url = `/admin-panel/dashboard/index`;
        const abortController = new AbortController();
        const token = localStorage.getItem("adminToken");
        const categoryColors = [
            "#3B82F6",
            "#8B5CF6",
            "#EC4899",
            "#10B981",
            "#F59E0B",
        ];

        const statsIconMap: Record<string, React.ReactNode> = {
            "Total sales": <DollarSign className="w-6 h-6 text-white" />,
            Orders: <ShoppingCart className="w-6 h-6 text-white" />,
            Users: <Users className="w-6 h-6 text-white" />,
            Items: <Package className="w-6 h-6 text-white" />,
        };

        const fetchData = async () => {
            const response = await sendRequest(
                "post",
                url,
                { months: selectedPeriod },
                abortController,
                token,
                router
            );

            if (response && response.success) {
                const categoriesWithColors = response.data.category_data.map(
                    (category: object, index: number) => ({
                        ...category,
                        color: categoryColors[index],
                    })
                );

                const statsWithIcons = response.data.stats.map(
                    (stat: { title: string }) => ({
                        ...stat,
                        icon: statsIconMap[stat.title] || null,
                    })
                );

                const salesWithTranslation = response.data.sales_data.map(
                    (sale: { name: string }) => ({
                        ...sale,
                        name: t(sale.name),
                    })
                );

                const trafficDataWithTranslation =
                    response.data.traffic_data.map((day: { day: string }) => ({
                        ...day,
                        day: t(day.day),
                    }));

                setStats(statsWithIcons);
                setSalesData(salesWithTranslation);
                setCategoryData(categoriesWithColors);
                setTrafficData(trafficDataWithTranslation);
                setRecentOrders(response.data.recent_orders);
            }
        };

        fetchData();

        return () => abortController.abort();
    }, [router, selectedPeriod, localeState, t]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-800";
            case "processing":
                return "bg-blue-100 text-blue-600";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "shipped":
                return "bg-blue-300 text-blue-800";
            case "canceled":
                return "bg-red-100 text-red-800";
            case "pendingToRefund":
                return "bg-gray-100 text-gray-400";
            case "refunding":
                return "bg-gray-300 text-gray-600";
            default:
                return "bg-gray-500 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {t("title")}
                        </h1>
                        <p className="text-gray-600">{t("subtitle")}</p>
                    </div>
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm font-medium"
                    >
                        <option value="1">{t("lastMonth")}</option>
                        <option value="3">{t("last3Months")}</option>
                        <option value="6">{t("last6Months")}</option>
                        <option value="12">{t("thisYear")}</option>
                    </select>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            {...stat}
                        />
                    ))}
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Sales & Orders Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                            {t("salesAndOrdersOverview")}
                        </h3>
                        <ResponsiveContainer
                            width="100%"
                            height={250}
                            minHeight={200}
                        >
                            <AreaChart
                                data={salesData}
                                margin={{
                                    top: 10,
                                    right: isRTL ? 5 : 20,
                                    left: isRTL ? 20 : 5,
                                    bottom: 5,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorSales"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#3B82F6"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#3B82F6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="colorOrders"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#8B5CF6"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#8B5CF6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#aaa"
                                />
                                <XAxis
                                    dataKey="name"
                                    stroke="#6B7280"
                                    reversed={isRTL}
                                    tick={{ fontSize: 12 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    stroke="#6B7280"
                                    orientation={isRTL ? "right" : "left"}
                                    yAxisId="left"
                                    dx={isRTL ? 50 : 0}
                                    tick={{ fontSize: 12 }}
                                    width={60}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: "12px" }}
                                    iconSize={12}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#3B82F6"
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                    name={t("sales")}
                                    yAxisId="left"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#8B5CF6"
                                    fillOpacity={1}
                                    fill="url(#colorOrders)"
                                    name={t("orders")}
                                    yAxisId="left"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                            {t("salesByCategory")}
                        </h3>
                        <ResponsiveContainer
                            width="100%"
                            height={350}
                            minHeight={300}
                        >
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    label={({
                                        cx,
                                        cy,
                                        midAngle = 0,
                                        outerRadius,
                                        name,
                                        percent = 0,
                                        fill,
                                    }) => {
                                        const RADIAN = Math.PI / 180;
                                        const radius =
                                            outerRadius + (isRTL ? 60 : 20);
                                        const x =
                                            cx +
                                            radius *
                                                Math.cos(-midAngle * RADIAN);
                                        const y =
                                            cy +
                                            radius *
                                                Math.sin(-midAngle * RADIAN);

                                        return (
                                            <text
                                                x={x}
                                                y={y}
                                                textAnchor={
                                                    x > cx ? "start" : "end"
                                                }
                                                dominantBaseline="central"
                                                fill={fill}
                                                className="text-[10px] sm:text-[12px] font-medium"
                                            >
                                                {`${name}: ${(
                                                    percent * 100
                                                ).toFixed(1)}%`}
                                            </text>
                                        );
                                    }}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        fontSize: "12px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Traffic & Conversions */}
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                            {t("weeklyTrafficAndConversions")}
                        </h3>
                        <ResponsiveContainer
                            width="100%"
                            height={250}
                            minHeight={200}
                        >
                            <BarChart
                                data={trafficData}
                                margin={{
                                    top: 10,
                                    right: isRTL ? 5 : 20,
                                    left: isRTL ? 20 : 5,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#aaa"
                                />
                                <XAxis
                                    dataKey="day"
                                    stroke="#6B7280"
                                    reversed={isRTL}
                                    tick={{ fontSize: 12 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    stroke="#6B7280"
                                    orientation={isRTL ? "right" : "left"}
                                    dx={isRTL ? 30 : 0}
                                    tick={{ fontSize: 12 }}
                                    width={50}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: "12px" }}
                                    iconSize={12}
                                />
                                <Bar
                                    dataKey="visits"
                                    fill="#3B82F6"
                                    radius={[8, 8, 0, 0]}
                                    barSize={25}
                                    name={t("visits")}
                                />
                                <Bar
                                    dataKey="signup"
                                    fill="#EC4899"
                                    radius={[8, 8, 0, 0]}
                                    barSize={25}
                                    name={t("signup")}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900">
                            {t("recentOrders")}
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        {tTable("orderId")}
                                    </th>
                                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        {tTable("totalAmount")}
                                    </th>
                                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        {tTable("dateOfDelivery")}
                                    </th>
                                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        {tTable("paymentMethod")}
                                    </th>
                                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        {tTable("status")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {order.total_amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {order.date_of_delivery}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {t(order.method)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                                    order.state
                                                )}`}
                                            >
                                                {t(order.state)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
