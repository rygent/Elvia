import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'translate',
	description: 'Translate your text.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'text',
			description: 'Text to translate.',
			type: ApplicationCommandOptionType.String,
			max_length: 2000,
			required: true
		},
		{
			name: 'from',
			description: 'Source language. (Defaults to auto)',
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: false
		},
		{
			name: 'to',
			description: 'Destination language. (Defaults to server language)',
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: false
		}
	],
	integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
	contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]
} as RESTPostAPIApplicationCommandsJSONBody;
