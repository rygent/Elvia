import { defineCollections, defineConfig } from 'fumadocs-mdx/config';
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
	lastModifiedTime: 'git',
	mdxOptions: {
		remarkImageOptions: {
			useImport: false
		}
	}
});
