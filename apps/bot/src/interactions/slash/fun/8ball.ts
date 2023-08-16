import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: '8ball',
	description: 'Ask magic 8ball.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'question',
			description: 'Question to ask.',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	dm_permission: true
} as RESTPostAPIApplicationCommandsJSONBody;
