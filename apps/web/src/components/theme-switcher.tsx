'use client';

import * as React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@elvia/ui';
import { cn } from '@elvia/utils';
import { Monitor, Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTheme } from 'next-themes';

const themes = [
	{ name: 'Light', icon: Sun03Icon },
	{ name: 'System', icon: Monitor },
	{ name: 'Dark', icon: Moon02Icon }
];

const switchVariants = cva(
	'gap-0 !rounded-full text-muted-foreground transition-colors duration-100 ease-ease hover:bg-transparent hover:text-foreground data-[state=on]:text-accent-foreground data-[state=on]:bg-transparent data-[state=on]:shadow-[0_0_0_1px] data-[state=on]:shadow-border',
	{
		variants: {
			size: {
				default: "h-8 w-8 min-w-8 [&_svg:not([class*='size-'])]:size-4",
				xs: "h-6 w-6 min-w-6 [&_svg:not([class*='size-'])]:size-3.5"
			}
		},
		defaultVariants: {
			size: 'default'
		}
	}
);

export interface ThemeSwitcherProps extends VariantProps<typeof switchVariants> {
	className?: string;
}

export function ThemeSwitcher({ className, size }: ThemeSwitcherProps) {
	const { theme, setTheme } = useTheme();

	return (
		<ToggleGroup
			type="single"
			value={theme}
			onValueChange={(value: string) => {
				if (value) setTheme(value);
			}}
			className={cn('gap-0 rounded-full shadow-[0_0_0_1px] shadow-border', className)}
		>
			{themes.map((item, index) => (
				<ToggleGroupItem key={index} value={item.name.toLowerCase()} className={cn(switchVariants({ size }))}>
					<HugeiconsIcon icon={item.icon} size={24} strokeWidth={2} fill="currentColor" />
					<span className="sr-only">{item.name}</span>
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}
