'use client';

import * as React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<SessionProvider>
			<NextThemesProvider {...props}>{children}</NextThemesProvider>
		</SessionProvider>
	);
}
