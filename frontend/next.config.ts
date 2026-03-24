import type { NextConfig } from 'next';
import { redirect } from 'next/dist/server/api-utils';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'b4dab939-ed98-43f6-94a4-172daa28c2a2.selstorage.ru',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',
            },
        ],
    },
    output: 'standalone',
};

module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/houses_announcements',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
