import { defineCollections, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const legal = defineCollections({
	type: 'doc',
	dir: 'content/legal',
	async: true,
	schema: frontmatterSchema.extend({
		date: z.string().date().or(z.date()).optional()
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
