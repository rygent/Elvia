import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	type RESTPostAPIApplicationCommandsJSONBody
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
	],
	dm_permission: true
} as RESTPostAPIApplicationCommandsJSONBody;
