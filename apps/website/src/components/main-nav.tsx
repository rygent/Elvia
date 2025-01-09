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
import { ExternalLink } from '@elvia/ui/icons';
import { cn } from '@elvia/utils';

export function MainNav() {
	return (
		<NavigationMenu className="hidden lg:flex">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:bg-accent/50 focus:bg-accent/50">
						Resources
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-3">
								<NavigationMenuLink asChild>
									<a
										className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
										href="/invite"
									>
										<Logo className="h-8 w-8" />
										<div className="mb-2 mt-4 text-lg font-medium">{siteConfig.global.name}</div>
										<p className="text-sm leading-tight text-muted-foreground">{siteConfig.global.description}</p>
									</a>
								</NavigationMenuLink>
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
								'gap-1 bg-transparent text-muted-foreground hover:bg-accent/50 focus:bg-accent/50'
							)}
							target="_blank"
							rel="noreferrer"
						>
							Vote on Top.gg
							<ExternalLink size={14} strokeWidth={1.5} />
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
							'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
							className
						)}
						{...props}
					>
						<div className="text-sm font-medium leading-none">{title}</div>
						<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
					</a>
				</NavigationMenuLink>
			</li>
		);
	}
);

ListItem.displayName = 'ListItem';
