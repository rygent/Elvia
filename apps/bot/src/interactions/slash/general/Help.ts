import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'help',
	description: 'Shows help information and commands.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'command',
			description: 'Command to get help for.',
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: false
		}
	],
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]
} as RESTPostAPIApplicationCommandsJSONBody;
