import * as React from 'react';
import { Banner } from '@/components/banner';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function HomeLayout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<main className="bg-background flex min-h-svh flex-col">
			<Banner dismissable />
			<Header />
			{children}
			<Footer />
		</main>
	);
}
