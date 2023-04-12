import { type APIApplicationCommand, type APIApplicationCommandOption, ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'userinfo',
	description: 'Get user information.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'member',
		description: 'Member to get.',
		type: ApplicationCommandOptionType.User,
		required: false
	}] as APIApplicationCommandOption[],
	dm_permission: false
} as APIApplicationCommand;
