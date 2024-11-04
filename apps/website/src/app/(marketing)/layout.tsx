import { Banner } from '@/components/banner';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { siteConfig } from '@/config';

type MarketingLayoutProps = React.PropsWithChildren;

export default function MarketingLayout({ children }: MarketingLayoutProps) {
	return (
		<>
			<Banner text={siteConfig.header.banner.text} dismissable />
			<SiteHeader />
			<>{children}</>
			<SiteFooter />
		</>
	);
}
