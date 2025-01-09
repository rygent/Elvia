import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allLegals } from 'contentlayer/generated';
import { MDXProvider } from '@/components/mdx/mdx-provider';
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

	return (
		<main className="relative py-6">
			<div className="space-y-2">
				<h1 className={cn('scroll-m-20 text-3xl font-bold tracking-tight')}>{doc.title}</h1>
				{doc.description && (
					<p className="text-base text-muted-foreground">
						<Balancer>{doc.description}</Balancer>
					</p>
				)}
			</div>
			<div className="pb-12 pt-8">
				<MDXProvider code={doc.body.code} />
			</div>
		</main>
	);
}
