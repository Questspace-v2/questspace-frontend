/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [{
            //cache all images, fonts, etc. in the public folder
            //Note: Next.js default is 'public, max-age=0' which cases many reloads on Safari!
            //Note: we use version hashes and therefore can use immutable
            source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|mp4|ttf|otf|woff|woff2)',

            headers: [{
                key: 'cache-control',
                value: 'public, max-age=31536000, immutable'
            }]
        }];
    },
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
    output: "standalone",
    experimental: {
        turbotrace: {
            // control the log level of the turbotrace, default is `error`
            logDetail: true,
            // show all log messages without limit
            // turbotrace only show 1 log message for each category by default
            logAll: true,
        },
    }
};

module.exports = nextConfig;
