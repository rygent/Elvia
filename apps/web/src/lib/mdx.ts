import { legal as allLegals } from 'content/source';
import { loader } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx';

export const legal = loader({
	baseUrl: '/legal',
	source: createMDXSource(allLegals)
});
