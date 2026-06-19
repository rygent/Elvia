import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/'
			}
		],
		host: siteConfig.global.url,
		sitemap: `${siteConfig.global.url}/sitemap.xml`
	};
}
