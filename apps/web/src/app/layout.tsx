import * as React from 'react';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { calSans, geistMono, geistSans } from '@/styles/fonts';
import { siteConfig } from '@/config';
import { cn } from '@elvia/utils';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@/styles/globals.css';

export const metadata: Metadata = {
	title: {
		default: siteConfig.global.name,
		template: `%s | ${siteConfig.global.name}`
	},
	description: siteConfig.global.description,
	keywords: siteConfig.global.keywords,
	authors: siteConfig.global.authors,
	creator: siteConfig.global.creator,
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: siteConfig.global.url,
		title: siteConfig.global.name,
		description: siteConfig.global.description,
		siteName: siteConfig.global.name
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.global.name,
		description: siteConfig.global.description,
		creator: `@${siteConfig.global.creator}`
	},
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon-32x32.png',
		apple: '/apple-touch-icon.png'
	}
};

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
	]
};

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={cn(`font-sans antialiased`, geistSans.variable, geistMono.variable, calSans.variable)}
				suppressHydrationWarning
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange enableColorScheme>
					{children}
				</ThemeProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
