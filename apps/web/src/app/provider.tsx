'use client';

import * as React from 'react';
import { NextProvider } from 'fumadocs-core/framework/next';
import { ThemeProvider } from 'next-themes';

export function Provider({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<NextProvider>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange enableColorScheme>
				{children}
			</ThemeProvider>
		</NextProvider>
	);
}
