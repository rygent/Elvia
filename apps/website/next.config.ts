import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	pageExtensions: ['ts', 'tsx'],
	poweredByHeader: false,
	reactStrictMode: false,
	eslint: {
		ignoreDuringBuilds: true
	},
	// eslint-disable-next-line @typescript-eslint/require-await
	async redirects() {
		return [
			{
				source: '/discord',
				destination: '/api/discord',
				permanent: true
			},
			{
				source: '/invite',
				destination: '/api/invite',
				permanent: true
			}
		];
	},
	transpilePackages: ['@elvia/ui', '@elvia/utils']
};

export default nextConfig;
