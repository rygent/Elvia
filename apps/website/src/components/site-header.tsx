import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';
import { siteConfig } from '@/config';
import { Button } from '@elvia/ui';
import { Topgg } from '@elvia/ui/icons';

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
			<div className="container flex h-14 max-w-screen-2xl items-center justify-between px-6 md:px-8">
				<div className="flex items-center">
					<Link
						href="/"
						className="mr-4 flex items-center space-x-2 transition-opacity duration-150 hover:opacity-80 lg:mr-6"
					>
						<Image
							alt={siteConfig.global.name}
							src={siteConfig.global.logo}
							width={24}
							height={24}
							className="rounded-md"
							aria-label={siteConfig.global.name}
						/>
						<span className="inline-block font-bold">{siteConfig.global.name}</span>
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
