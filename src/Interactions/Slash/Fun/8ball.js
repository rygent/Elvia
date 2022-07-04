import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';

export default {
	name: '8ball',
	description: 'Ask the magic 8ball a question.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'question',
		description: 'Question to ask.',
		type: ApplicationCommandOptionType.String,
		max_length: 1000,
		required: true
	}],
	dm_permission: true
};
