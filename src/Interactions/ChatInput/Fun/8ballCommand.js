const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');

module.exports = {
	name: '8ball',
	description: 'Ask the magic 8ball a question.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'question',
		description: 'Question to ask.',
		type: ApplicationCommandOptionType.String,
		required: true
	}]
};
