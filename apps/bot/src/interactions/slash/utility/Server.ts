import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'server',
	description: 'Use server commands.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'emoji',
			description: 'Emoji commands group.',
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: 'image',
					description: 'Get the full size image of an emoji.',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'emoji',
							description: 'The emoji to get.',
							type: ApplicationCommandOptionType.String,
							required: true
						}
					]
				},
				{
					name: 'list',
					description: 'List server emojis.',
					type: ApplicationCommandOptionType.Subcommand
				}
			]
		},
		{
			name: 'icon',
			description: 'Display the server icon.',
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: 'information',
			description: 'Get server information.',
			type: ApplicationCommandOptionType.Subcommand
		}
	],
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild]
} as RESTPostAPIApplicationCommandsJSONBody;
