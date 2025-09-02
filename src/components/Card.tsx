import CardProps from "@/interfaces/props/CardProps";

const Card: React.FC<CardProps> = ({ children }) => {
    return (
        <div className="bg-gray-100 backdrop-blur-xl mt-4 min-w-110 max-w-110 rounded-2xl shadow-2xl border border-white/20 p-8 sm:p-10">
            {children}
        </div>
    );
};

export default Card;
