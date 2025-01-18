import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { components } from '@/components/mdx';
import { legal } from '@/lib/mdx';
import { InlineTableOfContents, TableOfContents, TOCAnchorProvider } from '@elvia/ui';
import { Text } from '@elvia/ui/icons';
import { cn } from '@elvia/utils';
import { Timestamp } from '@sapphire/timestamp';
import Balancer from 'react-wrap-balancer';

interface LegalPageProps {
	params: Promise<{ slug: string }>;
}

export default async function LegalPage({ params }: LegalPageProps) {
	const { slug } = await params;

	const page = legal.getPage([slug]);
	if (!page) notFound();

	const doc = page.data;
	const { body: MDXContent, toc, lastModified } = await doc.load();
	const lastUpdated = new Timestamp('MMMM DD, YYYY').display(new Date(lastModified!));

	return (
		<TOCAnchorProvider toc={toc} single={false}>
			<div className="flex w-full min-w-0 flex-col">
				<nav className="sticky top-14 z-10 flex flex-row items-center bg-background/90 text-sm backdrop-blur transition-colors supports-[backdrop-filter]:bg-background/90 lg:hidden">
					<InlineTableOfContents toc={toc} />
				</nav>
				<article className="flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 pb-8 pt-8 max-md:pb-16 md:px-8 xl:mx-auto">
					<div className="space-y-2">
						<h1 className={cn('font-cal text-3xl font-bold tracking-wide')}>{doc.title}</h1>
						<p className="text-base text-muted-foreground">
							<Balancer>Last updated: {lastUpdated}</Balancer>
						</p>
					</div>
					<div className="prose text-justify text-foreground/80">
						<MDXContent components={components} />
					</div>
				</article>
			</div>
			<div className="sticky top-14 h-[calc(100vh-3.5rem)] pb-2 pt-4 max-lg:hidden">
				<div className="flex h-full max-w-full flex-col gap-3 pe-4">
					<h3 className="-ms-0.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
						<Text className="size-4" />
						On this page
					</h3>
					<TableOfContents toc={toc} />
				</div>
			</div>
		</TOCAnchorProvider>
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
