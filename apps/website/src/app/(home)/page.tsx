import { Hero } from '@/components/home/hero';
import { siteConfig } from '@/config';

export default function HomePage() {
	return (
		<div className="animate-in fade-in slide-in-from-top-6 mb-36 px-6 pt-16 duration-500 max-md:px-4">
			<Hero
				headline={siteConfig.homePage.hero.headline}
				subheadline={siteConfig.homePage.hero.subheadline}
				cta={siteConfig.homePage.hero.cta}
			/>
		</div>
	);
}
