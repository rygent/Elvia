import * as React from 'react';
import Image from 'next/image';
import { Link } from '@/components/link';
import { Heading } from '@/components/mdx/heading';
import { cn } from '@elvia/utils';
import { type MDXComponents } from 'mdx/types';

const defaultComponents: MDXComponents = {
	h1: ({ className, ...props }: React.ComponentProps<'h1'>) => (
		<Heading as="h1" className={cn('border-b', className)} {...props} />
	),
	h2: ({ className, ...props }: React.ComponentProps<'h2'>) => (
		<Heading as="h2" className={cn('border-b', className)} {...props} />
	),
	h3: ({ className, ...props }: React.ComponentProps<'h3'>) => <Heading as="h3" className={className} {...props} />,
	h4: ({ className, ...props }: React.ComponentProps<'h4'>) => <Heading as="h4" className={className} {...props} />,
	h5: ({ className, ...props }: React.ComponentProps<'h5'>) => <Heading as="h5" className={className} {...props} />,
	h6: ({ className, ...props }: React.ComponentProps<'h6'>) => <Heading as="h4" className={className} {...props} />,
	a: ({ className, href, ...props }: React.ComponentProps<'a'>) => (
		<Link className={className} href={href} {...props} />
	),
	img: ({ className, src, height, width, alt, ...props }: React.ComponentProps<'img'>) => (
		<Image
			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
			className={cn('rounded-lg', className)}
			src={(src as string) || ''}
			height={Number(height)}
			width={Number(width)}
			alt={alt || ''}
			{...props}
		/>
	)
};

function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultComponents,
		...components
	};
}

export { defaultComponents as components, getMDXComponents };
