import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'meme',
	description: 'Use memes commands.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'random',
			description: 'Displays random memes.',
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: 'fml',
			description: 'Get a random F My Life story.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'language',
					description: 'Optional language of the story.',
					type: ApplicationCommandOptionType.String,
					choices: [
						{
							name: 'English',
							value: 'en'
						},
						{
							name: 'Français',
							value: 'fr'
						}
					],
					required: false
				}
			]
		}
	],
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]
} as RESTPostAPIApplicationCommandsJSONBody;
