const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');

module.exports = {
	name: 'define',
	description: 'Define a word.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'word',
		description: 'Word to define.',
		type: ApplicationCommandOptionType.String,
		required: true
	}]
};
