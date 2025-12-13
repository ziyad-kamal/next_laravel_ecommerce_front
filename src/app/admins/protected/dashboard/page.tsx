import React, { useState } from "react";
import {
    ShoppingCart,
    DollarSign,
    Users,
    Package,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import {
    LineChart,
    Line,
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

interface StatCardProps {
    title: string;
    value: string;
    change: number;
    icon: React.ReactNode;
}

interface Order {
    id: string;
    customer: string;
    product: string;
    amount: string;
    status: "completed" | "pending" | "processing";
    date: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
    const isPositive = change >= 0;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                    {icon}
                </div>
                <div
                    className={`flex items-center text-sm font-bold ${
                        isPositive ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {isPositive ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(change)}%
                </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                {title}
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("7days");

    const stats = [
        {
            title: "Total Revenue",
            value: "$45,231",
            change: 12.5,
            icon: <DollarSign className="w-6 h-6 text-white" />,
        },
        {
            title: "Orders",
            value: "1,234",
            change: 8.2,
            icon: <ShoppingCart className="w-6 h-6 text-white" />,
        },
        {
            title: "Customers",
            value: "892",
            change: -2.4,
            icon: <Users className="w-6 h-6 text-white" />,
        },
        {
            title: "Products",
            value: "456",
            change: 5.1,
            icon: <Package className="w-6 h-6 text-white" />,
        },
    ];

    const revenueData = [
        { name: "Jan", revenue: 4200, orders: 240 },
        { name: "Feb", revenue: 3800, orders: 198 },
        { name: "Mar", revenue: 5100, orders: 310 },
        { name: "Apr", revenue: 4600, orders: 270 },
        { name: "May", revenue: 6200, orders: 380 },
        { name: "Jun", revenue: 5800, orders: 350 },
        { name: "Jul", revenue: 7200, orders: 420 },
        { name: "Aug", revenue: 6800, orders: 390 },
        { name: "Sep", revenue: 7800, orders: 450 },
        { name: "Oct", revenue: 8400, orders: 480 },
        { name: "Nov", revenue: 7600, orders: 440 },
        { name: "Dec", revenue: 9200, orders: 520 },
    ];

    const categoryData = [
        { name: "Electronics", value: 4500, color: "#3B82F6" },
        { name: "Clothing", value: 3200, color: "#8B5CF6" },
        { name: "Home & Garden", value: 2800, color: "#EC4899" },
        { name: "Sports", value: 2100, color: "#10B981" },
        { name: "Books", value: 1400, color: "#F59E0B" },
    ];

    const salesData = [
        { month: "Jan", sales: 65000 },
        { month: "Feb", sales: 59000 },
        { month: "Mar", sales: 80000 },
        { month: "Apr", sales: 81000 },
        { month: "May", sales: 95000 },
        { month: "Jun", sales: 88000 },
    ];

    const trafficData = [
        { day: "Mon", visits: 4200, conversions: 320 },
        { day: "Tue", visits: 3800, conversions: 280 },
        { day: "Wed", visits: 5100, conversions: 410 },
        { day: "Thu", visits: 4600, conversions: 360 },
        { day: "Fri", visits: 6200, conversions: 520 },
        { day: "Sat", visits: 7800, conversions: 680 },
        { day: "Sun", visits: 7200, conversions: 620 },
    ];

    const recentOrders: Order[] = [
        {
            id: "#12345",
            customer: "John Doe",
            product: "Wireless Headphones",
            amount: "$299",
            status: "completed",
            date: "2024-12-10",
        },
        {
            id: "#12346",
            customer: "Jane Smith",
            product: "Smart Watch",
            amount: "$399",
            status: "processing",
            date: "2024-12-10",
        },
        {
            id: "#12347",
            customer: "Bob Johnson",
            product: "Laptop Stand",
            amount: "$89",
            status: "pending",
            date: "2024-12-09",
        },
        {
            id: "#12348",
            customer: "Alice Brown",
            product: "USB-C Hub",
            amount: "$49",
            status: "completed",
            date: "2024-12-09",
        },
        {
            id: "#12349",
            customer: "Charlie Wilson",
            product: "Keyboard",
            amount: "$129",
            status: "processing",
            date: "2024-12-08",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
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
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                        <option value="year">This Year</option>
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
                    {/* Revenue & Orders Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Revenue & Orders Overview
                        </h3>
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient
                                        id="colorRevenue"
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
                                    stroke="#f0f0f0"
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
                                    dataKey="revenue"
                                    stroke="#3B82F6"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
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
                                            0
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
                    {/* Monthly Sales */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Monthly Sales Trend
                        </h3>
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <LineChart data={salesData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                />
                                <XAxis
                                    dataKey="month"
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
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    dot={{ fill: "#10B981", r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

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
                                    stroke="#f0f0f0"
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
                                />
                                <Bar
                                    dataKey="conversions"
                                    fill="#EC4899"
                                    radius={[8, 8, 0, 0]}
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
                                        Customer
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Date
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
                                            {order.customer}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {order.product}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {order.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {order.date}
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
