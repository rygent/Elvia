import * as React from 'react';
import { Banner } from '@/components/banner';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

type HomeLayoutProps = Readonly<React.PropsWithChildren>;

export default function HomeLayout({ children }: HomeLayoutProps) {
	return (
		<main className="bg-background flex min-h-svh flex-col">
			<Banner dismissable />
			<Header />
			{children}
			<Footer />
		</main>
	);
}
