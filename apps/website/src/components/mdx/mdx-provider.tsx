import * as React from 'react';
import { components } from '@/components/mdx/mdx-components';
import { useMDXComponent } from 'next-contentlayer2/hooks';

interface MDXProviderProps {
	code: string;
}

export function MDXProvider({ code }: MDXProviderProps) {
	const Component = useMDXComponent(code);

	return (
		<div className="mdx">
			<Component components={components} />
		</div>
	);
}
