import { BookMarked, Newspaper, SquareSlash } from 'lucide-react';

export const externalLink = {
	github: 'https://github.com/Rygent/Elvia',
	discord: 'https://discord.com/invite/FD5MMabf8Y',
	topgg: 'https://top.gg/bot/614645495779819551/vote',
	invite:
		'https://discord.com/api/oauth2/authorize?client_id={{client_id}}&permissions=10189542386807&scope=applications.commands%20bot'
} as const;

export const api = {
	github: 'https://api.github.com/repos/rygent/Elvia',
	betterstack: 'https://uptime.betterstack.com/api/v2/monitor-groups/1384070/monitors'
} as const;

export const siteConfig = {
	global: {
		url: 'https://elvia.vercel.app',
		name: 'Elvia',
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
	header: {
		menu: {
			label: 'Documentation',
			items: [
				{
					url: '/',
					name: 'Getting started',
					description: 'Learn to use Elvia on your discord server.',
					icon: BookMarked
				},
				{
					url: '/',
					name: 'Commands',
					description: 'Learn to use commands.',
					icon: SquareSlash
				}
			]
		},
		nav: {
			items: [
				{ url: '/', label: 'Blog', icon: Newspaper, external: false },
				{ url: externalLink.topgg, label: 'Vote on Top.gg', external: true }
			]
		}
	},
	footer: {
		nav: {
			items: [
				{ url: '/', label: 'Home' },
				{ url: '/', label: 'Documentation' },
				{ url: '/', label: 'Commands' },
				{ url: '/', label: 'Blog' }
			]
		}
	}
};
