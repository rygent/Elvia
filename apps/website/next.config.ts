import type { NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer2';

const nextConfig = {
	pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
	reactStrictMode: false,
	poweredByHeader: false,
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
} satisfies NextConfig;

export default withContentlayer(nextConfig);
