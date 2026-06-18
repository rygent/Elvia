import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: ['/api/']
			}
		],
		sitemap: `${siteConfig.global.url}/sitemap.xml`,
		host: siteConfig.global.url
	};
}
