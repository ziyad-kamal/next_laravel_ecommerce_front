import StatCardProps from "@/interfaces/props/StatCardProps";
import { TrendingDown, TrendingUp } from "lucide-react";

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

export default StatCard;
