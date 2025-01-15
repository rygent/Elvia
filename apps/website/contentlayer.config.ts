import { defineDocumentType, makeSource, type ComputedFields } from 'contentlayer2/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

const computedFields = {
	slug: {
		type: 'string',
		resolve: (doc) => `/${doc._raw.flattenedPath}`
	},
	slugAsParams: {
		type: 'string',
		resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/')
	}
} satisfies ComputedFields;

const Legal = defineDocumentType(() => ({
	name: 'Legal',
	filePathPattern: `legal/**/*.mdx`,
	contentType: 'mdx',
	fields: {
		title: {
			type: 'string',
			required: true
		},
		description: {
			type: 'string',
			required: false
		},
		toc: {
			type: 'boolean',
			default: true,
			required: false
		}
	},
	computedFields
}));

export default makeSource({
	contentDirPath: './content',
	documentTypes: [Legal],
	mdx: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeSlug,
			[
				rehypeAutolinkHeadings,
				{
					properties: {
						className: ['subheading-anchor'],
						ariaLabel: 'Link to section'
					}
				}
			]
		]
	}
});
