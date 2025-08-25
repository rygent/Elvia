import * as React from 'react';
import Link from 'next/link';
import { Animation } from '@/components/home/hero/animation';
import { externalLink } from '@/config';
import { badgeVariants, Button } from '@elvia/ui';
import { cn } from '@elvia/utils';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero({ className, ...props }: React.ComponentProps<'section'>) {
	return (
		<section className={cn('mx-auto flex max-w-7xl items-start justify-between', className)} {...props}>
			<div className="pt-4">
				<Link
					href={externalLink.github}
					target="_blank"
					className={cn(
						badgeVariants({ variant: 'outline' }),
						'cursor-pointer gap-x-2 rounded-full font-mono delay-75 duration-200 hover:bg-secondary [&>svg]:size-[15px]'
					)}
				>
					<Sparkles strokeWidth={1.5} className="scale-x-[-1]" />
					<span>Star us on GitHub</span>
					<ArrowRight strokeWidth={1.5} />
				</Link>
				<h1 className="mt-4 font-cal text-4xl text-balance md:text-5xl lg:text-6xl">
					Everything you need to manage Discord server
				</h1>
				<h2 className="mt-2 text-base text-balance text-muted-foreground md:text-lg lg:text-xl">
					The most powerful multipurpose Discord app.
				</h2>
				<div className="mt-5 flex flex-col gap-4 sm:flex-row">
					<Button size="lg" variant="default" className="text-base shadow-none" asChild>
						<Link href="/invite">Invite App</Link>
					</Button>
					<Button size="lg" variant="outline" className="text-base shadow-none" asChild>
						<Link href="/discord">Support Server</Link>
					</Button>
				</div>
			</div>
			<div className="hidden px-10 lg:block xl:px-20">
				<Animation />
			</div>
		</section>
	);
}
