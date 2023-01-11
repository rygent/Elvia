import { APIApplicationCommand, APIApplicationCommandOption, ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'translate',
	description: 'Translate your text.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'text',
		description: 'Text to translate.',
		type: ApplicationCommandOptionType.String,
		max_length: 2000,
		required: true
	}, {
		name: 'from',
		description: 'Source language. (Defaults to auto)',
		type: ApplicationCommandOptionType.String,
		autocomplete: true,
		required: false
	}, {
		name: 'to',
		description: 'Destination language. (Defaults to server language)',
		type: ApplicationCommandOptionType.String,
		autocomplete: true,
		required: false
	}] as APIApplicationCommandOption[],
	dm_permission: true
} as APIApplicationCommand;
