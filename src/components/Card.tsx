import CardProps from "@/interfaces/CardProps";

const Card: React.FC<CardProps> = ({ children }) => {
    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 sm:p-10">
            {children}
        </div>
    );
};

export default Card;
