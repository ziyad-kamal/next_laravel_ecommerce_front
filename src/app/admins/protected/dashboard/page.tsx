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

const Dashboard: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("6");
    const router = useRouter();
    const [stats, setStats] = useState([
        {
            title: "",
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

                setStats(statsWithIcons);
                setSalesData(response.data.sales_data);
                setCategoryData(categoriesWithColors);
                setTrafficData(response.data.traffic_data);
                setRecentOrders(response.data.recent_orders);
            }
        };

        fetchData();

        return () => abortController.abort();
    }, [router, selectedPeriod]);

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
                            E-commerce Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Track your business performance and analytics
                        </p>
                    </div>
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm font-medium"
                    >
                        <option value="1">Last month</option>
                        <option value="3">Last 3 month</option>
                        <option value="6">Last 6 month</option>
                        <option value="12">This Year</option>
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
                    {/* sales & Orders Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            sales & Orders Overview
                        </h3>
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <AreaChart data={salesData}>
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
                                />
                                <YAxis stroke="#6B7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#3B82F6"
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#8B5CF6"
                                    fillOpacity={1}
                                    fill="url(#colorOrders)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Sales by Category
                        </h3>
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent = 0 }) =>
                                        `${name}: ${(percent * 100).toFixed(
                                            1
                                        )}%`
                                    }
                                    outerRadius={100}
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
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Traffic & Conversions */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Weekly Traffic & Conversions
                        </h3>
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <BarChart data={trafficData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#aaa"
                                />
                                <XAxis
                                    dataKey="day"
                                    stroke="#6B7280"
                                />
                                <YAxis stroke="#6B7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="visits"
                                    fill="#3B82F6"
                                    radius={[8, 8, 0, 0]}
                                    barSize={30}
                                />
                                <Bar
                                    dataKey="conversions"
                                    fill="#EC4899"
                                    radius={[8, 8, 0, 0]}
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900">
                            Recent Orders
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        total amount
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        date of delivery
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        payment method
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Status
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
                                            {order.method}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                                    order.state
                                                )}`}
                                            >
                                                {order.state}
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
