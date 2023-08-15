import {
	type APIApplicationCommand,
	type APIApplicationCommandOption,
	ApplicationCommandOptionType,
	ApplicationCommandType
} from 'discord-api-types/v10';

export default {
	name: 'define',
	description: 'Define a word.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'word',
			description: 'Word to define.',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	] as APIApplicationCommandOption[],
	dm_permission: true
} as APIApplicationCommand;
