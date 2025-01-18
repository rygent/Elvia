import type { NextConfig } from 'next';
// @ts-expect-error @prisma/nextjs-monorepo-workaround-plugin is not typed
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';
import { createMDX } from 'fumadocs-mdx/next';
import '@/env';

const nextConfig = {
	pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
	reactStrictMode: false,
	poweredByHeader: false,
	eslint: {
		ignoreDuringBuilds: true
	},
	webpack(config, { isServer }) {
		if (isServer) {
			config.plugins = [...config.plugins, new PrismaPlugin()];
		}

		return config;
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

const withMDX = createMDX();

export default withMDX(nextConfig);
