import * as React from 'react';
import Link from 'next/link';
import { Logo, Topgg } from '@/components/icons';
import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';
import { siteConfig } from '@/config';
import { Button } from '@elvia/ui';

export function Header() {
	return (
		<header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/90 sticky top-0 z-50 w-full px-6 backdrop-blur max-md:px-4">
			<div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
				<div className="flex items-center">
					<Link href="/" className="flex items-center justify-center gap-x-2 lg:mr-5">
						<Logo className="h-5 w-5" />
						<span className="font-cal inline-block text-xl leading-5 font-bold tracking-wide whitespace-nowrap">
							{siteConfig.global.name}
						</span>
					</Link>
					<MainNav />
				</div>
				<div className="flex items-center gap-2">
					<nav className="flex items-center gap-0.5">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 rounded-full border focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:size-4"
							asChild
						>
							<Link href={siteConfig.external.links.topgg} target="_blank" rel="noreferrer">
								<Topgg className="h-4 w-4" />
								<span className="sr-only">Top.gg</span>
							</Link>
						</Button>
					</nav>
					<MobileNav />
				</div>
			</div>
		</header>
	);
}
