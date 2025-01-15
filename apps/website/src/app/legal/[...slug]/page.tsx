import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allLegals } from 'contentlayer/generated';
import { MDXContent } from '@/components/mdx';
import { getTableOfContents, InlineTableOfContents, TableOfContents, TOCAnchorProvider } from '@elvia/ui';
import { Text } from '@elvia/ui/icons';
import { cn } from '@elvia/utils';
import Balancer from 'react-wrap-balancer';
import '@/styles/mdx.css';

interface LegalPageProps {
	params: Promise<{ slug: string[] }>;
}

async function getLegalFromParams(props: LegalPageProps) {
	const params = await props.params;
	const slug = params.slug.join('/') || '';

	const doc = allLegals.find(({ slugAsParams }) => slugAsParams === slug);

	if (!doc) return null;

	return doc;
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
	const doc = await getLegalFromParams({ params });

	if (!doc) return {};

	return {
		title: doc.title,
		description: doc.description,
		openGraph: {
			title: doc.title,
			description: doc.description
		}
	};
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateStaticParams(): Promise<Awaited<LegalPageProps['params']>[]> {
	return allLegals.map(({ slugAsParams }) => ({
		slug: slugAsParams.split('/')
	}));
}

export default async function LegalPage({ params }: LegalPageProps) {
	const doc = await getLegalFromParams({ params });

	if (!doc) notFound();

	const toc = getTableOfContents(doc.body.raw);

	return (
		<TOCAnchorProvider toc={toc} single={false}>
			<div className="flex w-full min-w-0 flex-col">
				{doc.toc && (
					<nav className="sticky top-14 z-10 flex flex-row items-center bg-background/90 text-sm backdrop-blur transition-colors supports-[backdrop-filter]:bg-background/90 lg:hidden">
						<InlineTableOfContents toc={toc} />
					</nav>
				)}
				<article className="flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 pb-8 pt-8 max-md:pb-16 md:px-8 xl:mx-auto">
					<div className="space-y-2">
						<h1 className={cn('font-cal text-3xl font-bold tracking-wide')}>{doc.title}</h1>
						{doc.description && (
							<p className="text-base text-muted-foreground">
								<Balancer>{doc.description}</Balancer>
							</p>
						)}
					</div>
					<div className="prose text-foreground/80">
						<MDXContent code={doc.body.code} />
					</div>
				</article>
			</div>
			{doc.toc && (
				<div className="sticky top-14 h-[calc(100vh-3.5rem)] pb-2 pt-4 max-lg:hidden">
					<div className="flex h-full max-w-full flex-col gap-3 pe-4">
						<h3 className="-ms-0.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
							<Text className="size-4" />
							On this page
						</h3>
						<TableOfContents toc={toc} />
					</div>
				</div>
			)}
		</TOCAnchorProvider>
	);
}
