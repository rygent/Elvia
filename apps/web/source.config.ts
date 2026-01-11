import { defineCollections, defineConfig } from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { z } from 'zod';

export const legal = defineCollections({
	type: 'doc',
	dir: 'content/legal',
	async: false,
	schema: z.object({
		title: z.string(),
		description: z.string().optional()
	})
});

export default defineConfig({
	mdxOptions: {
		remarkImageOptions: {
			useImport: false
		}
	},
	plugins: [lastModified({ versionControl: 'git' })]
});
