'use client';

import * as React from 'react';
import { ThemeProvider } from 'next-themes';

export function Provider({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange enableColorScheme>
			{children}
		</ThemeProvider>
	);
}
