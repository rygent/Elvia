import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config';

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = ['/', '/legal/privacy', '/legal/terms'].map((route) => ({
		url: `${siteConfig.global.url}${route}`,
		lastModified: new Date()
	}));

	return [...routes];
}
