import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'tag',
	description: 'Send an existing server tag.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'name',
			description: 'The tag name to get.',
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: true
		}
	],
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild]
} as RESTPostAPIApplicationCommandsJSONBody;
