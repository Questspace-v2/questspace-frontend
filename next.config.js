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
            },
            {
                protocol: 'https',
                hostname: 'source.unsplash.com',
                port: '',
                pathname: '/**'
            },
            {
                hostname: 'lh3.googleusercontent.com'
            }
        ],
    },
    output: "standalone"
};

module.exports = nextConfig;
