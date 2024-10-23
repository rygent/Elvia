import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	pageExtensions: ['ts', 'tsx'],
	poweredByHeader: false,
	reactStrictMode: false,
	transpilePackages: ['@elvia/ui']
};

export default nextConfig;
