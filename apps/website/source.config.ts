import { defineCollections, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config';

export const legal = defineCollections({
	type: 'doc',
	dir: 'content/legal',
	async: true,
	schema: frontmatterSchema
});

export default defineConfig({
	lastModifiedTime: 'git',
	mdxOptions: {
		remarkImageOptions: {
			useImport: false
		}
	}
});
