import * as React from 'react';
import { Banner } from '@/components/banner';
import { SiteHeader } from '@/components/site-header';
import { siteConfig } from '@/config';

type HomeLayoutProps = React.PropsWithChildren;

export default function HomeLayout({ children }: HomeLayoutProps) {
	return (
		<>
			<Banner text={siteConfig.header.banner.text} dismissable />
			<SiteHeader />
			<>{children}</>
		</>
	);
}
