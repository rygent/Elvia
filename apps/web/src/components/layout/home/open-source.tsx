'use client';

import * as React from 'react';
import Link from 'next/link';
import { Github } from '@/components/icons';
import { fetcher } from '@/lib/fetcher';
import { api, externalLink } from '@/config';
import { cn } from '@elvia/utils';
import useSWR from 'swr';

export function OpenSource({ className, ...props }: React.ComponentProps<'section'>) {
	const { data } = useSWR<{ stargazers_count: number }>(api.github, (url: string) =>
		fetcher(url, { headers: { Accept: 'application/vnd.github+json' } })
	);

	const [stars, setStars] = React.useState<number>(0);

	React.useEffect(() => {
		if (!data) return;

		const { stargazers_count } = data;

		setStars(stargazers_count);
	}, [data]);

	return (
		<section className={cn('mx-auto max-w-7xl text-center', className)} {...props}>
			<h2 className="mx-auto mt-8 max-w-2xl font-cal text-3xl font-bold lg:text-5xl">Proudly open-source</h2>
			<p className="mx-auto mt-2 max-w-2xl px-6 text-lg text-muted-foreground">
				Our source code is available on GitHub - feel free to read, review, or contribute to it however you want!
			</p>
			<div className="mt-5 flex justify-center gap-x-2">
				<Link href={externalLink.github} target="_blank" rel="noreferrer" className="group flex">
					<div className="flex h-10 items-center justify-center space-x-2 rounded-md bg-secondary px-4 text-secondary-foreground group-hover:bg-secondary/80 [&_svg]:size-5">
						<Github />
						<span>Star us on GitHub</span>
					</div>
					<div className="flex items-center">
						<div className="h-4 w-4 border-y-8 border-r-8 border-l-0 border-solid border-secondary border-y-transparent group-hover:border-secondary/80 group-hover:border-y-transparent" />
						<div className="flex h-10 items-center rounded-md bg-secondary px-4 font-medium text-secondary-foreground group-hover:bg-secondary/80">
							{stars}
						</div>
					</div>
				</Link>
			</div>
		</section>
	);
}
