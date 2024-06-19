import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'avatar',
	description: 'Display the avatar of the provided user.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'user',
			description: 'User to display.',
			type: ApplicationCommandOptionType.User,
			required: false
		}
	],
	integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
	contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]
} as RESTPostAPIApplicationCommandsJSONBody;
