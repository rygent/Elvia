import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = ['', '/legal/privacy', '/legal/terms'].map((route) => ({
		url: `https://elvia.web.id${route}`,
		lastModified: new Date().toISOString().split('T')[0]
	}));

	return [...routes];
}
