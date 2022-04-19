const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');

module.exports = {
	name: 'translate',
	description: 'Translate your text.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'text',
		description: 'Text to translate.',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: 'from',
		description: 'Source language. (Defaults to auto)',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: 'to',
		description: 'Destination language. (Defaults to server language)',
		type: ApplicationCommandOptionType.String,
		required: false
	}]
};
