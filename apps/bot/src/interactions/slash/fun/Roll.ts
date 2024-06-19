import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'roll',
	description: 'Roll random number with optional minimum and maximum numbers or using a dice.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'min',
			description: 'Minimum value.',
			type: ApplicationCommandOptionType.Integer,
			required: false
		},
		{
			name: 'max',
			description: 'Maximum value.',
			type: ApplicationCommandOptionType.Integer,
			required: false
		},
		{
			name: 'dice',
			description: 'Roll a dice. (Example: 2d6)',
			type: ApplicationCommandOptionType.String,
			required: false
		}
	],
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild]
} as RESTPostAPIApplicationCommandsJSONBody;
