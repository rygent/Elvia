'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ToggleGroup, ToggleGroupItem } from '@elvia/ui';
import { Laptop, Moon, Sun } from '@elvia/ui/icons';
import { cn, cva, type VariantProps } from '@elvia/utils';
import { useTheme } from 'next-themes';

const themes = [
	{ name: 'Light', icon: Sun },
	{ name: 'System', icon: Laptop },
	{ name: 'Dark', icon: Moon }
];

const switchVariants = cva(
	'gap-0 rounded-full text-muted-foreground transition-colors duration-100 ease-ease hover:bg-transparent hover:text-foreground data-[state=on]:bg-transparent data-[state=on]:shadow-[0_0_0_1px] data-[state=on]:shadow-border',
	{
		variants: {
			size: {
				default: 'h-8 w-8 min-w-8 [&_svg]:size-4',
				xs: 'h-6 w-6 min-w-6 [&_svg]:size-[14px]'
			}
		},
		defaultVariants: {
			size: 'default'
		}
	}
);

interface ThemeSwitcherProps extends VariantProps<typeof switchVariants> {
	className?: string;
}

export const ThemeSwitcher = dynamic<ThemeSwitcherProps>(() => Promise.resolve(ThemeSwitcherComponent), { ssr: false });

function ThemeSwitcherComponent({ className, size }: ThemeSwitcherProps) {
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
					<item.icon size={24} strokeWidth={2} />
					<span className="sr-only">{item.name}</span>
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}
