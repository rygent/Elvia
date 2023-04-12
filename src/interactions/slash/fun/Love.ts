import { type APIApplicationCommand, type APIApplicationCommandOption, ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'love',
	description: 'Calculate love percentage between two users.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: '1st',
		description: '1st user.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: '2nd',
		description: '2nd user.',
		type: ApplicationCommandOptionType.User,
		required: true
	}] as APIApplicationCommandOption[],
	dm_permission: false
} as APIApplicationCommand;
