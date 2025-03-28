import * as React from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

type HomeLayoutProps = Readonly<React.PropsWithChildren>;

export default function HomeLayout({ children }: HomeLayoutProps) {
	return (
		<main className="bg-background flex min-h-svh flex-col">
			<Header />
			{children}
			<Footer />
		</main>
	);
}
