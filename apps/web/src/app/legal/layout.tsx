import * as React from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

type LegalLayoutProps = Readonly<React.PropsWithChildren>;

export default function LegalLayout({ children }: LegalLayoutProps) {
	return (
		<main className="bg-background flex min-h-svh flex-col">
			<Header />
			<div className="relative mx-auto max-w-7xl items-start lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
				{children}
			</div>
			<Footer />
		</main>
	);
}
