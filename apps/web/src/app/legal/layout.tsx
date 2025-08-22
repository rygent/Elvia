import * as React from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function LegalLayout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<main className="flex min-h-svh flex-col bg-background">
			<Header />
			<div className="relative mx-auto max-w-7xl items-start lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
				{children}
			</div>
			<Footer />
		</main>
	);
}
