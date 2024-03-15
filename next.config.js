/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        unoptimized: false,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.dicebear.com",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "storage.yandexcloud.net",
                port: "",
                pathname: "/questspace-img/**",
            }
        ],
    },
    output: "standalone"
};

module.exports = nextConfig;
