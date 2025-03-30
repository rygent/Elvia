import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { components } from '@/components/mdx';
import { legal } from '@/lib/mdx';
import { TOC, TOCInline, TOCInlineItems, TOCInlineTrigger, TOCItems, TOCProvider } from '@elvia/ui';
import { cn } from '@elvia/utils';

interface LegalPageProps {
	params: Promise<{ slug: string }>;
}

export default async function LegalPage({ params }: LegalPageProps) {
	const { slug } = await params;

	const page = legal.getPage([slug]);
	if (!page) notFound();

	const doc = page.data;
	const { body: MDXContent, toc } = await doc.load();
	const lastModified = new Date(doc.date!).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	return (
		<TOCProvider toc={toc} single={false}>
			<div className="flex w-full min-w-0 flex-col">
				<TOCInline className="h-10 lg:hidden">
					<TOCInlineTrigger items={toc} className="w-full" />
					<TOCInlineItems items={toc} />
				</TOCInline>
				<article className="flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 pt-8 pb-8 max-md:pb-16 md:px-6 xl:mx-auto">
					<div className="space-y-2">
						<h1 className={cn('font-cal text-3xl font-bold tracking-wide')}>{doc.title}</h1>
						<p className="text-muted-foreground text-base text-balance">Last updated: {lastModified}</p>
					</div>
					<div className="prose text-foreground/80 text-justify">
						<MDXContent components={components} />
					</div>
				</article>
			</div>
			<TOC className="max-lg:hidden">
				<TOCItems items={toc} />
			</TOC>
		</TOCProvider>
	);
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
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

export function generateStaticParams(): Awaited<LegalPageProps['params']>[] {
	return legal.getPages().map((page) => ({
		slug: page.slugs[0]!
	}));
}
