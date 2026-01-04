import React from "react";
import { useTranslations } from "next-intl";

const Home = () => {
    const t = useTranslations("home");

    return (
        <div className="mt-9 px-6 py-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t("title")}
            </h1>
            <p className="text-gray-600 text-lg">{t("subtitle")}</p>
        </div>
    );
};

export default Home;
