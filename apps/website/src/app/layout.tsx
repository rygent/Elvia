import * as React from 'react';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { calSans, geistMono, geistSans } from '@/styles/fonts.ts';
import { siteConfig } from '@/config';
import { cn } from '@elvia/utils';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@elvia/ui/globals.css';

export const metadata: Metadata = {
	title: {
		default: siteConfig.global.name,
		template: `%s | ${siteConfig.global.name}`
	},
	description: siteConfig.global.description,
	creator: siteConfig.global.creator,
	icons: {
		icon: '/favicon.ico'
		// shortcut: '/favicon-16x16.png',
		// apple: '/apple-touch-icon.png'
	}
};

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
	]
};

type RootLayoutProps = React.PropsWithChildren;

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={cn(
					`min-h-svh bg-background font-sans antialiased`,
					geistSans.variable,
					geistMono.variable,
					calSans.variable
				)}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<main className="min-h-svh bg-background">{children}</main>
				</ThemeProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
