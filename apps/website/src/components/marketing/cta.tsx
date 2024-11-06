import * as React from 'react';
import Link from 'next/link';
import { getGitHubStars } from '@/utils/github';
import { siteConfig } from '@/config';
import { Github } from '@elvia/ui/icons';
import { cn } from '@elvia/utils';

interface CallToActionProps {
	headline: string;
	subheadline: string;
	className?: string;
}

export async function CallToAction({ headline, subheadline, className }: CallToActionProps) {
	const stars = (await getGitHubStars()) ?? 99999;

	return (
		<section className={cn('mx-auto max-w-2xl px-6 text-center', className)}>
			<h2 className="mx-auto mt-8 max-w-2xl font-cal text-3xl font-bold lg:text-5xl">{headline}</h2>
			<p className="mt-4 text-lg text-muted-foreground">{subheadline}</p>
			<div className="mt-10 flex justify-center space-x-2">
				<Link href={siteConfig.external.links.github} target="_blank" rel="noreferrer" className="group flex">
					<div className="flex h-10 items-center justify-center space-x-2 rounded-md bg-secondary px-4 text-secondary-foreground group-hover:bg-secondary/80">
						<Github size={18} />
						<span>Star us on GitHub</span>
					</div>
					<div className="flex items-center">
						<div className="h-4 w-4 border-y-8 border-l-0 border-r-8 border-solid border-secondary border-y-transparent group-hover:border-secondary/80 group-hover:border-y-transparent" />
						<div className="flex h-10 items-center rounded-md bg-secondary px-4 font-medium text-secondary-foreground group-hover:bg-secondary/80">
							{stars}
						</div>
					</div>
				</Link>
			</div>
		</section>
	);
}
