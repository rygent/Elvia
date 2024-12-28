'use client';

import * as React from 'react';
import { Button } from '@elvia/ui';
import { Moon, Sun } from '@elvia/ui/icons';
import { useTheme } from 'next-themes';

export function ModeSwitcher() {
	const { setTheme, resolvedTheme } = useTheme();

	return (
		<Button
			variant="ghost"
			className="group/toggle h-9 w-9 px-0 focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:size-5"
			onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
		>
			<Sun className="hidden [html.dark_&]:block" strokeWidth={1.5} size={24} />
			<Moon className="hidden [html.light_&]:block" strokeWidth={1.5} size={24} />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
