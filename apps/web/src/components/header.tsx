import * as React from 'react';
import Link from 'next/link';
import { Logo, Topgg } from '@/components/icons';
import { MobileMenu } from '@/components/mobile-menu';
import { siteConfig } from '@/config';
import {
	Button,
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
	NavigationMenuViewport
} from '@elvia/ui';
import { cn } from '@elvia/utils';
import { ExternalLink } from 'lucide-react';

export function Header({ className, ...props }: React.ComponentProps<'header'>) {
	return (
		<header
			className={cn(
				'sticky top-0 z-50 w-full bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/90 max-md:px-4',
				className
			)}
			{...props}
		>
			<nav className="mx-auto flex h-14 w-full max-w-7xl flex-row items-center">
				<Link href="/" className="flex items-center justify-center gap-x-2 lg:mr-5">
					<Logo className="h-5 w-5" />
					<span className="inline-block font-cal text-xl leading-5 font-bold tracking-wide whitespace-nowrap">
						{siteConfig.global.name}
					</span>
				</Link>
				<NavigationBar className="max-md:hidden" />
				<div className="flex flex-1 flex-row items-center justify-end gap-1.5">
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
					<MobileMenu />
				</div>
			</nav>
		</header>
	);
}

function NavigationBar({ ...props }: React.ComponentProps<typeof NavigationMenu>) {
	return (
		<NavigationMenu viewport={false} data-viewport {...props}>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:bg-accent/50 focus:bg-accent/50">
						Resources
					</NavigationMenuTrigger>
					<NavigationMenuContent className="p-0">
						<ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-3">
								<NavigationMenuLink
									className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none select-none hover:bg-transparent focus:shadow-md"
									asChild
								>
									<Link href="/invite">
										<Logo className="size-8 text-foreground" />
										<div className="mt-4 mb-2 font-cal text-lg font-medium">{siteConfig.global.name}</div>
										<p className="text-sm leading-tight text-muted-foreground">{siteConfig.global.description}</p>
									</Link>
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
					<NavigationMenuLink
						className={cn(
							navigationMenuTriggerStyle(),
							'flex-row bg-transparent text-muted-foreground hover:bg-accent/50 focus:bg-accent/50'
						)}
						asChild
					>
						<Link href={siteConfig.external.links.topgg} target="_blank" rel="noreferrer">
							Vote on Top.gg
							<ExternalLink strokeWidth={1.5} className="size-3.5 text-current" />
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
			<NavigationMenuViewport className="rounded-xl" />
		</NavigationMenu>
	);
}

function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink
				className="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
				asChild
			>
				<Link href={href}>
					<div className="text-sm leading-none font-medium">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}
