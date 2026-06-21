import type { MetadataRoute } from 'next';
import { legal } from '@/lib/source';
import { siteConfig } from '@/config';

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const url = (path: string): string => new URL(path, siteConfig.global.url).toString();

	const legals = await Promise.all(
		legal.getPages().map((page) => {
			const { lastModified } = page.data;

			return {
				url: url(page.url),
				lastModified: lastModified ? new Date(lastModified) : undefined,
				changeFrequency: 'monthly',
				priority: 0.8
			} as MetadataRoute.Sitemap[number];
		})
	);

	return [
		{
			url: siteConfig.global.url,
			changeFrequency: 'yearly',
			priority: 1
		},
		...legals.filter((v) => v !== undefined)
	];
}
