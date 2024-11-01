'use client';

import * as React from 'react';
import Link from 'next/link';
import { DesktopNav } from '@/components/desktop-nav';
import { siteConfig } from '@/config';
import { buttonVariants, Github } from '@elvia/ui';
import { cn } from '@elvia/utils';

interface HeaderProps extends React.PropsWithChildren {
	/**
	 * When to use transparent header
	 * @defaultValue none
	 */
	transparentMode?: 'always' | 'top' | 'none';
}

export function SiteHeader({ transparentMode = 'none' }: HeaderProps) {
	const [transparent, setTransparent] = React.useState(transparentMode !== 'none');

	React.useEffect(() => {
		if (transparentMode !== 'top') return;

		const listener = (): void => {
			setTransparent(window.scrollY < 10);
		};

		listener();
		window.addEventListener('scroll', listener);
		return () => {
			window.removeEventListener('scroll', listener);
		};
	}, [transparentMode]);

	return (
		<header
			className={cn('sticky top-0 z-50 w-full', {
				'border-transparent': transparent,
				'border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60': !transparent
			})}
		>
			<div className="container flex h-14 max-w-screen-2xl items-center">
				<DesktopNav />
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<nav className="flex items-center">
						<Link href={siteConfig.external.links.github} target="_blank" rel="noreferrer">
							<div
								className={cn(
									buttonVariants({
										variant: 'ghost'
									}),
									'h-8 w-8 px-0'
								)}
							>
								<Github className="h-4 w-4" />
								<span className="sr-only">GitHub</span>
							</div>
						</Link>
					</nav>
				</div>
			</div>
		</header>
	);
}
