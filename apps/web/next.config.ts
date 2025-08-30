import { type NextConfig } from 'next';
import { createMDX } from 'fumadocs-mdx/next';
import '@/env';

const nextConfig = {
	pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
	reactStrictMode: false,
	poweredByHeader: false,
	eslint: {
		ignoreDuringBuilds: true
	},
	experimental: {
		optimizePackageImports: ['@elvia/ui']
	},
	transpilePackages: ['@elvia/ui', '@elvia/utils']
} satisfies NextConfig;

const withMDX = createMDX();

export default withMDX(nextConfig);
