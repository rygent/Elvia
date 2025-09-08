'use client';

import * as React from 'react';
import NextLink from 'next/link';

interface LinkProps extends React.ComponentProps<'a'> {
	external?: boolean;
	prefetch?: boolean;
}

export function Link({
	children,
	href = '#',
	external = Boolean(/^\w+:/.exec(href)) || href.startsWith('//'),
	prefetch,
	ref,
	...props
}: LinkProps) {
	if (external) {
		return (
			<a ref={ref} href={href} rel="noreferrer noopener" target="_blank" {...props}>
				{children}
			</a>
		);
	}

	return (
		<NextLink ref={ref} href={href} prefetch={prefetch} {...props}>
			{children}
		</NextLink>
	);
}
