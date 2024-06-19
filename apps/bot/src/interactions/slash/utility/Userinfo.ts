import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'userinfo',
	description: 'Get user information.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'member',
			description: 'Member to get.',
			type: ApplicationCommandOptionType.User,
			required: false
		}
	],
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild]
} as RESTPostAPIApplicationCommandsJSONBody;
