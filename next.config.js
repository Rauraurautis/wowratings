/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'd1l7zpp9jd00vm.cloudfront.net'
            }
        ]
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(mp3)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    publicPath: '/_next/static/sounds/', // Customize this path as needed
                    outputPath: 'static/sounds/', // Customize this path as needed
                },
            },
        });

        return config;
    },
}

module.exports = nextConfig
