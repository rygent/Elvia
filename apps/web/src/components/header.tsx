import * as React from 'react';
import { Elvia } from '@/components/icons';
import { Link } from '@/components/link';
import { MobileMenu } from '@/components/mobile-menu';
import {
	NavbarMenu,
	NavbarMenuContent,
	NavbarMenuItem,
	NavbarMenuLink,
	NavbarMenuTrigger
} from '@/components/ui/navbar';
import { externalLink, siteConfig } from '@/config';
import { Button } from '@elvia/ui';
import { cn } from '@elvia/utils';
import { ArrowUpRight01Icon, GithubIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export function Header({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<NavbarMenu className={className} {...props}>
			<Link href="/" className="inline-flex items-center gap-x-2.5">
				<Elvia size={20} />
				<span className="inline-block font-heading text-xl leading-5 font-bold tracking-wide whitespace-nowrap">
					{siteConfig.global.name}
				</span>
			</Link>
			<ul className="flex flex-row items-center gap-2 px-6 max-sm:hidden">
				<NavbarMenuItem>
					<NavbarMenuTrigger className="duration-100 ease-ease">{siteConfig.header.menu.label}</NavbarMenuTrigger>
					<NavbarMenuContent className="md:grid-cols-2">
						{siteConfig.header.menu.items.map((item, index) => (
							<NavbarMenuLink
								key={index}
								href={item.url}
								className="rounded-lg border bg-card p-3 duration-100 ease-ease hover:bg-accent/80 hover:text-accent-foreground [&_svg]:size-7!"
							>
								<HugeiconsIcon
									icon={item.icon}
									strokeWidth={2}
									className="mb-2 rounded-md border bg-secondary p-1 text-secondary-foreground"
								/>
								<p className="font-medium">{item.name}</p>
								<p className="text-sm text-muted-foreground">{item.description}</p>
							</NavbarMenuLink>
						))}
					</NavbarMenuContent>
				</NavbarMenuItem>
				{siteConfig.header.nav.items.map((item, index) => (
					<NavbarMenuItem key={index}>
						<NavbarMenuLink
							href={item.url}
							className={cn(
								'inline-flex flex-row p-2 text-muted-foreground transition-colors duration-100 ease-ease hover:bg-transparent',
								item.external && 'gap-x-px'
							)}
							target={item.external ? '_blank' : undefined}
							rel={item.external ? 'noreferrer' : undefined}
						>
							<p className="text-sm">{item.label}</p>
							{item.external && (
								<HugeiconsIcon icon={ArrowUpRight01Icon} size={10} strokeWidth={2} className="top-0.5" />
							)}
						</NavbarMenuLink>
					</NavbarMenuItem>
				))}
			</ul>
			<div className="flex flex-1 flex-row items-center justify-end gap-1.5 max-sm:hidden">
				<div className="flex flex-row items-center empty:hidden">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 rounded-full border border-border focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
						asChild
					>
						<Link href={externalLink.github} external>
							<HugeiconsIcon icon={GithubIcon} strokeWidth={2} />
							<span className="sr-only">GitHub</span>
						</Link>
					</Button>
				</div>
			</div>
			<ul className="ms-auto flex flex-row items-center justify-end gap-1.5 sm:hidden">
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 rounded-full border border-border focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
					asChild
				>
					<Link href={externalLink.github} external>
						<HugeiconsIcon icon={GithubIcon} strokeWidth={2} />
						<span className="sr-only">GitHub</span>
					</Link>
				</Button>
				<MobileMenu />
			</ul>
		</NavbarMenu>
	);
}
