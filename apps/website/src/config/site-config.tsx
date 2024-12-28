import Logo from '@/assets/logo.jpg';

export const siteConfig = {
	global: {
		url: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
		name: 'Elvia',
		logo: Logo,
		title: 'Elvia - The most powerful multipurpose Discord app.',
		description: 'The most powerful multipurpose Discord app.',
		keywords: ['Discord', 'Bot', 'Multipurpose', 'Moderation', 'Games', 'Utilities', 'Social'],
		authors: [
			{
				name: 'rygent'
			}
		],
		creator: 'rygent',
		thumbnail: '/images/og-image.png',
		twitter: {
			creator: '@rygent'
		}
	},
	external: {
		api: {
			github: 'https://api.github.com/repos/rygent/Elvia'
		},
		links: {
			github: 'https://github.com/Rygent/Elvia',
			discord: 'https://discord.com/invite/FD5MMabf8Y',
			topgg: 'https://top.gg/bot/614645495779819551/vote',
			invite:
				'https://discord.com/api/oauth2/authorize?client_id={{client_id}}&permissions=10189542386807&scope=applications.commands%20bot'
		}
	},
	header: {
		banner: {
			text: 'We are going live soon! Get notified when launched.'
		},
		nav: {
			links: [
				{ href: '/docs', label: 'Docs' },
				{ href: '/commands', label: 'Commands' },
				{ href: '/blog', label: 'Blog' }
			]
		}
	},
	homePage: {
		hero: {
			headline: 'Everything you need\n to manage Discord server',
			subheadline: 'The most powerful multipurpose Discord app.',
			cta: [
				{ label: 'Invite App', href: '/invite' },
				{ label: 'Support Server', href: '/discord' }
			]
		},
		cta: {
			headline: 'Proudly open-source',
			subheadline:
				'Our source code is available on GitHub - feel free to read, review, or contribute to it however you want!'
		}
	}
};
