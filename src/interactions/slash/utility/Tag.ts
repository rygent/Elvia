import { APIApplicationCommand, APIApplicationCommandOption, ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'tag',
	description: 'Send a server tag.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'name',
		description: 'The tag name to get.',
		type: ApplicationCommandOptionType.String,
		autocomplete: true,
		required: true
	}] as APIApplicationCommandOption[],
	dm_permission: false
} as APIApplicationCommand;
