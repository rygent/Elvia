'use client';

import * as React from 'react';
import Link from 'next/link';
import { Github } from '@/components/icons';
import { fetcher } from '@/lib/fetcher';
import { siteConfig } from '@/config';
import { cn } from '@elvia/utils';
import useSWR from 'swr';

interface OpenSourceProps {
	headline: string;
	subheadline: string;
	className?: string;
}

export function OpenSource({ headline, subheadline, className }: OpenSourceProps) {
	const { data } = useSWR<{ stargazers_count: number }>('https://api.github.com/repos/rygent/Elvia', (url: string) =>
		fetcher(url, { headers: { Accept: 'application/vnd.github+json' } })
	);

	const [stars, setStars] = React.useState<number>(0);

	React.useEffect(() => {
		if (!data) return;

		const { stargazers_count } = data;

		setStars(stargazers_count);
	}, [data]);

	return (
		<section className={cn('mx-auto max-w-7xl text-center', className)}>
			<h2 className="font-cal mx-auto mt-8 max-w-2xl text-3xl font-bold lg:text-5xl">{headline}</h2>
			<p className="text-muted-foreground mx-auto mt-2 max-w-2xl px-6 text-lg">{subheadline}</p>
			<div className="mt-5 flex justify-center gap-x-2">
				<Link href={siteConfig.external.links.github} target="_blank" rel="noreferrer" className="group flex">
					<div className="bg-secondary text-secondary-foreground group-hover:bg-secondary/80 flex h-10 items-center justify-center space-x-2 rounded-md px-4">
						<Github className="h-[18px] w-[18px]" />
						<span>Star us on GitHub</span>
					</div>
					<div className="flex items-center">
						<div className="border-secondary group-hover:border-secondary/80 h-4 w-4 border-y-8 border-r-8 border-l-0 border-solid border-y-transparent group-hover:border-y-transparent" />
						<div className="bg-secondary text-secondary-foreground group-hover:bg-secondary/80 flex h-10 items-center rounded-md px-4 font-medium">
							{stars}
						</div>
					</div>
				</Link>
			</div>
		</section>
	);
}
