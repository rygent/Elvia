'use client';

import * as React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { siteConfig } from '@/config';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle
} from '@elvia/ui';
import { cn } from '@elvia/utils';
import { ExternalLink } from 'lucide-react';

export function MainNav() {
	return (
		<NavigationMenu className="hidden lg:flex">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="text-muted-foreground hover:bg-accent/50 focus:bg-accent/50 bg-transparent">
						Resources
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-3">
								<Link href="/invite" legacyBehavior passHref>
									<NavigationMenuLink className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md">
										<Logo className="text-foreground size-8" />
										<div className="mt-4 mb-2 text-lg font-medium">{siteConfig.global.name}</div>
										<p className="text-muted-foreground text-sm leading-tight">{siteConfig.global.description}</p>
									</NavigationMenuLink>
								</Link>
							</li>
							<ListItem href="/" title="Commands">
								A list of available commands.
							</ListItem>
							<ListItem href="/" title="Blog">
								The latest posts and changes.
							</ListItem>
							<ListItem href="/" title="Changelog">
								See what changes.
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<Link href={siteConfig.external.links.topgg} legacyBehavior passHref>
						<NavigationMenuLink
							className={cn(
								navigationMenuTriggerStyle(),
								'text-muted-foreground hover:bg-accent/50 focus:bg-accent/50 flex-row bg-transparent'
							)}
							target="_blank"
							rel="noreferrer"
						>
							Vote on Top.gg
							<ExternalLink strokeWidth={1.5} className="size-3.5 text-current" />
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = React.forwardRef<React.ComponentRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
	({ className, title, children, ...props }, ref) => {
		return (
			<li>
				<NavigationMenuLink asChild>
					<a
						ref={ref}
						className={cn(
							'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none',
							className
						)}
						{...props}
					>
						<div className="text-sm leading-none font-medium">{title}</div>
						<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
					</a>
				</NavigationMenuLink>
			</li>
		);
	}
);

ListItem.displayName = 'ListItem';
