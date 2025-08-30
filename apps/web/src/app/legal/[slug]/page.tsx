import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LastUpdated } from '@/components/last-updated';
import { components } from '@/components/mdx';
import { TocItems, TocProvider, TocTitle } from '@/components/ui/toc';
import { TocPopover, TocPopoverContent, TocPopoverTrigger } from '@/components/ui/toc-popover';
import { legal } from '@/lib/mdx';
import { cn } from '@elvia/utils';

export default async function LegalPage({ params }: PageProps<'/legal/[slug]'>) {
	const { slug } = await params;

	const page = legal.getPage([slug]);
	if (!page) notFound();

	const doc = page.data;
	const { body: MDXContent, lastModified, toc } = doc;

	return (
		<TocProvider toc={toc} single={false}>
			<div
				className={cn(
					'relative mx-auto mt-14 max-w-7xl items-start lg:grid lg:gap-10',
					toc.length > 0 && 'lg:grid-cols-[1fr_300px]'
				)}
			>
				<div className="flex w-full min-w-0 flex-col">
					<TocPopover className="lg:hidden">
						<TocPopoverTrigger />
						<TocPopoverContent>
							<TocItems />
						</TocPopoverContent>
					</TocPopover>
					<article className="flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 pt-12 pb-8 max-md:pb-16 md:px-6 md:pt-8 xl:mx-auto">
						<div className="space-y-2">
							<h1 className="font-cal text-3xl font-bold tracking-wide">{doc.title}</h1>
							<LastUpdated date={lastModified!} className="text-balance" />
						</div>
						<div className="prose text-justify text-foreground/80">
							<MDXContent components={components} />
						</div>
					</article>
				</div>
				{toc.length > 0 && (
					<div className="sticky top-14 h-[calc(100vh-3.5rem)] pt-8 pb-2 max-lg:hidden">
						<div className="flex h-full max-w-full flex-col pe-4">
							<TocTitle />
							<TocItems />
						</div>
					</div>
				)}
			</div>
		</TocProvider>
	);
}

export async function generateMetadata({ params }: PageProps<'/legal/[slug]'>): Promise<Metadata> {
	const { slug } = await params;

	const page = legal.getPage([slug]);
	if (!page) notFound();

	const doc = page.data;

	return {
		title: doc.title,
		description: doc.description,
		openGraph: {
			title: doc.title,
			description: doc.description
		}
	};
}

export function generateStaticParams(): Awaited<PageProps<'/legal/[slug]'>['params']>[] {
	return legal.getPages().map((page) => ({
		slug: page.slugs[0]!
	}));
}
