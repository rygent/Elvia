const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');

module.exports = {
	name: 'roulette',
	description: 'Get a random winner from the roulette.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'title',
		description: 'The title of the winner.',
		type: ApplicationCommandOptionType.String,
		required: true
	}]
};
