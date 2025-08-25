'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { type ThemeSwitcherProps } from '@/components/theme-switcher';
import { siteConfig } from '@/config';
import { Button, Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@elvia/ui';
import { ChevronDown } from 'lucide-react';

const StatusBadge = dynamic(() => import('@/components/status').then((mod) => mod.StatusBadge), { ssr: false });
const ThemeSwitcher = dynamic<ThemeSwitcherProps>(
	() => import('@/components/theme-switcher').then((mod) => mod.ThemeSwitcher),
	{
		ssr: false
	}
);

const legal = [
	{ url: '/legal/terms', label: 'Terms of Service' },
	{ url: '/legal/privacy', label: 'Privacy Policy' }
];

export function Footer() {
	const [year, setYear] = React.useState<number>(new Date().getFullYear());

	React.useEffect(() => {
		setYear(new Date().getFullYear());
	}, []);

	return (
		<footer className="border-t border-border bg-card px-4 py-5 md:px-6">
			<nav
				aria-label="Directory"
				className="mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr] items-center justify-between gap-x-2 gap-y-6 max-[750px]:grid-cols-[1fr]"
			>
				<div className="flex flex-row items-center gap-x-4 max-[750px]:flex-col max-[750px]:items-start max-[750px]:gap-y-6">
					<Link href="/" className="flex h-fit">
						<Logo className="h-[15px] w-[15px]" />
					</Link>
					<ul className="grid w-full list-none grid-cols-2 items-start gap-4 min-[601px]:flex min-[601px]:items-center">
						{siteConfig.footer.nav.items.map((item, index) => (
							<li key={index} className="text-sm">
								<Button
									variant="link"
									className="h-fit justify-start p-0 text-sm font-normal text-muted-foreground transition-colors duration-100 ease-ease hover:text-foreground hover:no-underline"
									asChild
								>
									<Link href={item.url}>{item.label}</Link>
								</Button>
							</li>
						))}
						<li className="text-sm">
							<Legal />
						</li>
					</ul>
				</div>
				<div className="flex items-center justify-end gap-4 max-[750px]:justify-between">
					<StatusBadge />
					<ThemeSwitcher size="xs" />
				</div>
			</nav>
			<div className="mx-auto flex w-full max-w-7xl flex-col flex-nowrap justify-between">
				<p className="mt-4 text-[12px] leading-4 font-normal whitespace-nowrap text-muted-foreground">
					&copy; {year}, All rights reserved.
				</p>
			</div>
		</footer>
	);
}

function Legal() {
	const [open, setOpen] = React.useState<boolean>(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="link"
					className="h-fit cursor-pointer justify-start gap-[2px] !p-0 text-sm font-normal text-muted-foreground transition-colors duration-100 ease-ease hover:text-foreground hover:no-underline"
				>
					Legal
					<ChevronDown size={16} strokeWidth={1.5} />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="flex w-52 flex-col gap-x-2 rounded-xl p-2"
				side="top"
				onCloseAutoFocus={(event) => event.preventDefault()}
			>
				{legal.map((item, index) => (
					<PopoverClose key={index} asChild>
						<Button
							variant="link"
							className="h-10 w-full justify-start rounded-md px-2 text-sm font-normal text-foreground hover:bg-accent hover:no-underline"
							asChild
						>
							<Link href={item.url}>{item.label}</Link>
						</Button>
					</PopoverClose>
				))}
			</PopoverContent>
		</Popover>
	);
}
