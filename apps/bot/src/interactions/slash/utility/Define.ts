import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'define',
	description: 'Define a word.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'word',
			description: 'Word to define.',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]
} as RESTPostAPIApplicationCommandsJSONBody;
