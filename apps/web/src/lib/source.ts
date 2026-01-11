import { loader } from 'fumadocs-core/source';
import { legal as allLegals } from 'fumadocs-mdx:collections/server';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

export const legal = loader(toFumadocsSource(allLegals, []), {
	baseUrl: '/legal'
});
