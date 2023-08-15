import {
	type APIApplicationCommand,
	type APIApplicationCommandOption,
	ApplicationCommandOptionType,
	ApplicationCommandType
} from 'discord-api-types/v10';

export default {
	name: 'help',
	description: 'Shows help information and commands.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'command',
			description: 'Command to get help for.',
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: false
		}
	] as APIApplicationCommandOption[],
	dm_permission: true
} as APIApplicationCommand;
