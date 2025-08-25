import * as React from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function HomeLayout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<main className="flex min-h-svh flex-col bg-background">
			<Header />
			{children}
			<Footer />
		</main>
	);
}
