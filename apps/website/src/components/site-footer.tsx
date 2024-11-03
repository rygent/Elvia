import Image from 'next/image';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { siteConfig } from '@/config';
import { Discord, Github, Separator } from '@elvia/ui';

const links = [
	{
		label: 'Resources',
		links: [
			{
				label: 'Documentation',
				href: '/docs'
			},
			{
				label: 'Commands',
				href: '/commands'
			},
			{
				label: 'Blog',
				href: '/blog'
			}
		]
	},
	{
		label: 'Legal',
		links: [
			{
				label: 'Terms of Service',
				href: '/legal/terms'
			},
			{
				label: 'Privacy Policy',
				href: '/legal/privacy'
			}
		]
	}
];

const socialLinks = [
	{ icon: Github, href: siteConfig.external.links.github, label: 'GitHub' },
	{ icon: Discord, href: siteConfig.external.links.discord, label: 'Discord' }
];

export function SiteFooter() {
	return (
		<footer className="container bg-card py-8">
			<Separator className="mb-12 mt-4" />
			<div className="flex flex-col items-start justify-between gap-10 lg:flex-row">
				<div className="max-w-sm">
					<Link href="/" className="mr-8 flex items-center space-x-2 transition-all duration-200 hover:opacity-80">
						<Image
							src={siteConfig.global.logo}
							alt={siteConfig.global.name}
							loading="lazy"
							width={24}
							height={24}
							className="rounded-md"
						/>
						<span className="inline-block font-bold">{siteConfig.global.name}</span>
					</Link>
					<p className="text-md mt-4 text-muted-foreground">{siteConfig.global.description}</p>
					<div className="mt-4 flex items-center space-x-4">
						{socialLinks.map((link, index) => (
							<Link
								href={link.href}
								key={index}
								target="_blank"
								className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
							>
								<link.icon size={20} />
								<span className="sr-only">{link.label}</span>
							</Link>
						))}
					</div>
					<ThemeSwitcher className="mt-6" />
				</div>
				<div className="flex gap-4 sm:gap-16">
					{links.map((group, index) => (
						<div key={index}>
							<h2 className="font-bold">{group.label}</h2>
							<ul className="mt-2 space-y-2">
								{group.links.map((link, index) => (
									<li key={index}>
										<Link
											href={link.href}
											className="inline-flex items-center gap-1 text-muted-foreground transition-colors duration-200 hover:text-foreground"
											target={link.href.startsWith('http') ? '_blank' : undefined}
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
			<p className="mb-4 mt-12 text-sm text-muted-foreground">
				Copyright &copy; {new Date().getFullYear()} {siteConfig.global.name}. All rights reserved.
			</p>
		</footer>
	);
}
