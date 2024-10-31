import { Banner } from '@/components/banner';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { siteConfig } from '@/config';

export default function MarketingLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Banner text={siteConfig.header.banner.text} dismissable />
      <SiteHeader transparentMode="top" />
      <>{children}</>
      <SiteFooter />
    </>
  );
}
