import type { UserFlags } from 'discord-api-types/v10';

export const Badges = {
	Staff: '<:discord_employee:852852657940463646>',
	Partner: '<:partnered_server_owner:852862048865615872>',
	Hypesquad: '<:hypesquad_events:852862248883585084>',
	BugHunterLevel1: '<:bughunter_level_1:852862422489366558>',
	HypeSquadOnlineHouse1: '<:house_bravery:852862599515078696>',
	HypeSquadOnlineHouse2: '<:house_brilliance:852862728116502559>',
	HypeSquadOnlineHouse3: '<:house_balance:852862917505187850>',
	PremiumEarlySupporter: '<:premium_early_supporter:852863146750246962>',
	TeamPseudoUser: '',
	BugHunterLevel2: '<:bughunter_level_2:852863794614501378>',
	VerifiedBot: '',
	VerifiedDeveloper: '<:verified_developer:852864284933226526>',
	CertifiedModerator: '<:certified_moderator:864765437018767371>',
	BotHTTPInteractions: '',
	Spammer: '',
	ActiveDeveloper: '<:active_developer:1045142312176586762>',
	Quarantined: ''
} as Record<keyof typeof UserFlags, string>;
