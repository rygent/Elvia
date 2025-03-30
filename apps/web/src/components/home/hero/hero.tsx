import * as React from 'react';
import Link from 'next/link';
import { Animation } from '@/components/home/hero/animation';
import { siteConfig } from '@/config';
import { badgeVariants, Button } from '@elvia/ui';
import { cn } from '@elvia/utils';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
	headline: string;
	subheadline: string;
	cta: {
		label: string;
		href: string;
	}[];
}

export function Hero({ headline, subheadline, cta }: HeroProps) {
	return (
		<section className="mx-auto flex max-w-7xl items-start justify-between">
			<div className="pt-4">
				<Link
					href={siteConfig.external.links.github}
					target="_blank"
					className={cn(
						badgeVariants({ variant: 'outline' }),
						'hover:bg-secondary cursor-pointer gap-x-2 rounded-full font-mono delay-75 duration-200 [&>svg]:size-[15px]'
					)}
				>
					<Sparkles strokeWidth={1.5} className="scale-x-[-1]" />
					<span>Star us on GitHub</span>
					<ArrowRight strokeWidth={1.5} />
				</Link>
				<h1 className="font-cal mt-4 text-4xl text-balance md:text-5xl lg:text-6xl">{headline}</h1>
				<h2 className="text-muted-foreground mt-2 text-base text-balance md:text-lg lg:text-xl">{subheadline}</h2>
				<div className="mt-5 flex flex-col gap-4 sm:flex-row">
					{cta[0] && (
						<Button size="lg" variant="default" className="text-base shadow-none" asChild>
							<Link href={cta[0].href}>{cta[0].label}</Link>
						</Button>
					)}
					{cta[1] && (
						<Button size="lg" variant="outline" className="text-base shadow-none" asChild>
							<Link href={cta[1].href}>{cta[1].label}</Link>
						</Button>
					)}
				</div>
			</div>
			<div className="hidden px-10 lg:block xl:px-20">
				<Animation />
			</div>
		</section>
	);
}
