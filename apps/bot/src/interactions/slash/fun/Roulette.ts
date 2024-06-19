import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'roulette',
	description: 'Get a random winner from the roulette.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'title',
			description: 'The title of the winner.',
			type: ApplicationCommandOptionType.String,
			max_length: 500,
			required: true
		}
	],
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild]
} as RESTPostAPIApplicationCommandsJSONBody;
