import * as React from 'react';
import { TreeContextProvider } from '@/components/context/tree';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { legal } from '@/lib/source';

export default function LegalLayout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<TreeContextProvider tree={legal.pageTree}>
			<main className="flex min-h-svh flex-col bg-background">
				<Header />
				{children}
				<Footer />
			</main>
		</TreeContextProvider>
	);
}
