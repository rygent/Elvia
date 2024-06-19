import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'banner',
	description: 'Display the banner of the provided user.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'user',
			description: 'User to display.',
			type: ApplicationCommandOptionType.User,
			required: false
		},
		{
			name: 'color',
			description: "Display user's banner color.",
			type: ApplicationCommandOptionType.Boolean,
			required: false
		}
	],
	integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
	contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]
} as RESTPostAPIApplicationCommandsJSONBody;
