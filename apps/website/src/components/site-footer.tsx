'use client';

import * as React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { StatusIndicator } from '@/components/status';
import { ThemeSwitcher } from '@/components/theme-switcher';
import type { Monitor } from '@/types/betterstack';
import { Button, Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@elvia/ui';
import { ChevronDown } from '@elvia/ui/icons';

interface SiteFooterProps {
	status: Monitor[] | null;
}

const navigation = [
	{ name: 'Home', href: '/' },
	{ name: 'Docs', href: '/docs' },
	{ name: 'Commands', href: '/commands' },
	{ name: 'Blog', href: '/blog' }
];

const legal = [
	{ name: 'Terms of Service', href: '/legal/terms' },
	{ name: 'Privacy Policy', href: '/legal/privacy' }
];

export function SiteFooter({ status }: SiteFooterProps) {
	const [year, setYear] = React.useState<number>(new Date().getFullYear());

	React.useEffect(() => {
		setYear(new Date().getFullYear());
	}, []);

	return (
		<footer className="border-t border-border bg-card px-6 py-5">
			<nav
				aria-label="Directory"
				className="mx-auto grid w-full max-w-[1200px] grid-cols-[auto_1fr] items-center justify-between gap-x-2 gap-y-6 max-[750px]:grid-cols-[1fr]"
			>
				<div className="flex flex-row items-center gap-x-4 max-[750px]:flex-col max-[750px]:items-start max-[750px]:gap-y-6">
					<Link href="/" className="flex h-fit">
						<Logo className="h-[15px] w-[15px]" />
					</Link>
					<ul className="grid w-full list-none grid-cols-2 items-start gap-4 min-[601px]:flex min-[601px]:items-center">
						{navigation.map((item, index) => (
							<li key={index} className="text-sm">
								<Button
									variant="link"
									className="h-fit justify-start p-0 text-sm font-normal text-muted-foreground transition-colors duration-100 ease-ease hover:text-foreground hover:no-underline"
									asChild
								>
									<Link href={item.href}>{item.name}</Link>
								</Button>
							</li>
						))}
						<li className="text-sm">
							<Legal />
						</li>
					</ul>
				</div>
				<div className="flex items-center justify-end gap-4 max-[750px]:justify-between">
					{status && <StatusIndicator data={status} />}
					<ThemeSwitcher size="xs" />
				</div>
			</nav>
			<div className="mx-auto flex w-full max-w-[1200px] flex-col flex-nowrap justify-between">
				<p className="mt-4 whitespace-nowrap text-[12px] font-normal leading-4 text-muted-foreground">
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
					className="h-fit justify-start gap-[2px] p-0 text-sm font-normal text-muted-foreground transition-colors duration-100 ease-ease hover:text-foreground hover:no-underline"
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
							className="h-10 w-full justify-start px-2 text-sm font-normal text-foreground hover:bg-accent hover:no-underline"
							asChild
						>
							<Link href={item.href}>{item.name}</Link>
						</Button>
					</PopoverClose>
				))}
			</PopoverContent>
		</Popover>
	);
}
