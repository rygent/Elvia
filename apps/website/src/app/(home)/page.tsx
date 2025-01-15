import { CallToAction } from '@/components/home/cta';
import { Hero } from '@/components/home/hero';
import { siteConfig } from '@/config';

export default function HomePage() {
	return (
		<main className="container mb-36 pt-16 duration-500 animate-in fade-in slide-in-from-top-6 max-md:px-6">
			<Hero
				headline={siteConfig.homePage.hero.headline}
				subheadline={siteConfig.homePage.hero.subheadline}
				cta={siteConfig.homePage.hero.cta}
			/>
			<CallToAction headline={siteConfig.homePage.cta.headline} subheadline={siteConfig.homePage.cta.subheadline} />
		</main>
	);
}
