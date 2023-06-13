import {
	type APIApplicationCommand,
	ApplicationCommandOptionType,
	ApplicationCommandType
} from 'discord-api-types/v10';

export default {
	name: 'server',
	description: 'Use server commands.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'information',
			description: 'Get server information.',
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: 'icon',
			description: 'Display the server icon.',
			type: ApplicationCommandOptionType.Subcommand
		}
	],
	dm_permission: false
} as APIApplicationCommand;
