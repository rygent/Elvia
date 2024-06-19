import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: '8ball',
	description: 'Ask magic 8ball.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'question',
			description: 'Question to ask.',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild, InteractionContextType.BotDM]
} as RESTPostAPIApplicationCommandsJSONBody;
