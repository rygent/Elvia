import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heading } from '@/components/mdx/heading';
import { cn } from '@elvia/utils';

export const components = {
	h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<Heading as="h1" className={cn('text-4xl font-bold', className)} {...props} />
	),
	h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<Heading
			as="h2"
			className={cn('border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0', className)}
			{...props}
		/>
	),
	h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<Heading as="h3" className={cn('text-xl font-semibold tracking-tight', className)} {...props} />
	),
	h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<Heading as="h4" className={cn('text-lg font-semibold tracking-tight', className)} {...props} />
	),
	h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<Heading as="h5" className={cn('text-lg font-semibold tracking-tight', className)} {...props} />
	),
	h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<Heading as="h4" className={cn('text-base font-semibold tracking-tight', className)} {...props} />
	),
	a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
		<a className={cn('font-medium text-blue-600 underline dark:text-blue-400', className)} {...props} />
	),
	p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
		<p className={cn('leading-7 text-foreground/80 [&:not(:first-child)]:mt-6', className)} {...props} />
	),
	ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
		<ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
	),
	ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
		<ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
	),
	li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<li className={cn('mt-2', className)} {...props} />
	),
	blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)} {...props} />
	),
	img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
		<img className={cn('rounded-md', className)} alt={alt} {...props} />
	),
	hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => <hr className="my-4 md:my-8" {...props} />,
	table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
		<div className="my-6 w-full overflow-y-auto">
			<table className={cn('relative w-full overflow-hidden border-none text-sm', className)} {...props} />
		</div>
	),
	tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
		<tr className={cn('last:border-b-none m-0 border-b', className)} {...props} />
	),
	th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
		<th
			className={cn(
				'px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
				className
			)}
			{...props}
		/>
	),
	td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
		<td
			className={cn('px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right', className)}
			{...props}
		/>
	),
	pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
		<pre className={cn('mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border', className)} {...props} />
	),
	code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<code className={cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm', className)} {...props} />
	),
	Image,
	Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
		<Link className={cn('font-medium text-blue-600 underline dark:text-blue-400', className)} {...props} />
	)
};
