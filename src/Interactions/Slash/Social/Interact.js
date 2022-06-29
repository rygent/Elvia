import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';

export default {
	name: 'interact',
	description: 'Interact with someone.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'kiss',
		description: 'Kiss someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'hug',
		description: 'Hug someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'baka',
		description: 'Say baka to someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'bite',
		description: 'Bite someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'blush',
		description: 'Blust at someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'confused',
		description: 'Someone made you confused.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'cry',
		description: 'Someone made you cry.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'cuddle',
		description: 'Cuddle someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'feed',
		description: 'Feed someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'greet',
		description: 'Greet someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'slap',
		description: 'Slap someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'pat',
		description: 'Pat someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'smile',
		description: 'Someone made you smile.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'stare',
		description: 'Stare at someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'smug',
		description: 'Smug at someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'punch',
		description: 'Punch someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'poke',
		description: 'Poke someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'highfive',
		description: 'Highfive someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'handholding',
		description: 'Hold the hand of someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'dance',
		description: 'Dance with someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'tickle',
		description: 'Tickle someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}],
	dm_permission: false
};
