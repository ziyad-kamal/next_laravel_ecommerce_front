import type { NextConfig } from "next";

import nextIntlObj from "next-intl/plugin";
const nextIntl = nextIntlObj();

const nextConfig: NextConfig = {
    images: {
        domains: ["localhost"], // Add your backend domain here
        remotePatterns: [
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "8000",
                pathname: "/storage/**",
            },
        ],
    },
};

export default nextIntl(nextConfig);
