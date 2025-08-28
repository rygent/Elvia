import * as React from 'react';
import Link from 'next/link';
import { Topgg } from '@/components/icons';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { MenuBar, MenuBarContent, MenuBarLink, MenuBarTrigger } from '@/components/ui/menubar';
import { externalLink, siteConfig } from '@/config';
import { Button, ScrollArea } from '@elvia/ui';
import { cn } from '@elvia/utils';

export function MobileMenu({ className, ...props }: React.ComponentProps<typeof MenuBarTrigger>) {
	return (
		<MenuBar>
			<MenuBarTrigger className={cn('group data-[state=open]:bg-transparent', className)} asChild {...props}>
				<Button
					variant="ghost"
					size="icon"
					className="relative flex h-8 w-8 flex-col gap-0 !rounded-full border ps-[6px] pe-[6px] duration-200 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
				>
					<span
						data-position="top"
						className="absolute h-[1.5px] w-[14px] translate-y-[-3.5px] bg-foreground transition-transform duration-[160ms] [transition-timing-function:cubic-bezier(0.31,0.05,0.43,1.02)] group-data-[state=open]:translate-y-0 group-data-[state=open]:scale-110 group-data-[state=open]:rotate-45"
					/>
					<span
						data-position="bottom"
						className="absolute h-[1.5px] w-[14px] translate-y-[3.5px] bg-foreground transition-transform duration-[160ms] [transition-timing-function:cubic-bezier(0.31,0.05,0.43,1.02)] group-data-[state=open]:translate-y-0 group-data-[state=open]:scale-110 group-data-[state=open]:-rotate-45"
					/>
					<span className="sr-only">Toggle menu</span>
				</Button>
			</MenuBarTrigger>
			<MenuBarContent className="sm:flex-row sm:items-center sm:justify-end">
				<ScrollArea>
					<div className="mb-4 flex flex-col">
						<p className="mb-1 text-sm text-muted-foreground">{siteConfig.header.menu.label}</p>
						{siteConfig.header.menu.items.map((item, index) => (
							<MenuBarLink
								key={index}
								href={item.url}
								className="inline-flex items-center gap-2 py-1.5 transition-colors hover:text-popover-foreground/50 data-[active=true]:font-medium data-[active=true]:text-primary [&_svg]:size-4"
							>
								<item.icon />
								{item.name}
							</MenuBarLink>
						))}
					</div>
					{siteConfig.header.nav.items
						.filter((item) => !item.external)
						.map((item, index) => (
							<MenuBarLink
								key={index}
								href={item.url}
								className="inline-flex items-center gap-2 py-1.5 transition-colors hover:text-popover-foreground/50 data-[active=true]:font-medium data-[active=true]:text-primary [&_svg]:size-4"
							>
								{item.icon && <item.icon />}
								{item.label}
							</MenuBarLink>
						))}
				</ScrollArea>
				<div className="-ms-1 flex flex-row items-center gap-1.5 max-sm:mt-2">
					<Button
						variant="ghost"
						size="icon"
						className="-me-1 h-8 w-8 focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:!size-5"
						asChild
					>
						<Link href={externalLink.topgg} target="_blank" rel="noreferrer">
							<Topgg />
							<span className="sr-only">Top.gg</span>
						</Link>
					</Button>
					<div role="separator" className="flex-1" />
					<ThemeSwitcher size="xs" />
				</div>
			</MenuBarContent>
		</MenuBar>
	);
}
