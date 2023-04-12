import { type APIApplicationCommand, type APIApplicationCommandOption, ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'roll',
	description: 'Roll random number with optional minimum and maximum numbers or using a dice.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'min',
		description: 'Minimum value.',
		type: ApplicationCommandOptionType.Integer,
		required: false
	}, {
		name: 'max',
		description: 'Maximum value.',
		type: ApplicationCommandOptionType.Integer,
		required: false
	}, {
		name: 'dice',
		description: 'Roll a dice. (Example: 2d6)',
		type: ApplicationCommandOptionType.String,
		required: false
	}] as APIApplicationCommandOption[],
	dm_permission: true
} as APIApplicationCommand;
