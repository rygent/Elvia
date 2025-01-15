import * as React from 'react';
import { SiteHeader } from '@/components/site-header';

type LegalLayoutProps = React.PropsWithChildren;

export default function LegalLayout({ children }: LegalLayoutProps) {
	return (
		<>
			<SiteHeader />
			<main className="relative mx-auto max-w-[1200px] items-start lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
				{children}
			</main>
		</>
	);
}
