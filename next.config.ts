import type { NextConfig } from "next";

import nextIntlObj from "next-intl/plugin";
const nextIntl = nextIntlObj();

const nextConfig: NextConfig = {
    // Your other config options can go here
};

export default nextIntl(nextConfig);
