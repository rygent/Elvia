import { Hero } from '@/components/home/hero';
import { OpenSource } from '@/components/home/open-source';

export default function HomePage() {
	return (
		<div className="relative mt-14 mb-36 animate-in px-6 pt-16 duration-500 fade-in slide-in-from-top-6 max-md:px-4">
			<Hero />
			<OpenSource />
		</div>
	);
}
