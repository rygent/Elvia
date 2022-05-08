const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');

module.exports = {
	name: 'image',
	description: 'Use images commands.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'art',
		description: 'Sends Art images from Imgur.',
		type: ApplicationCommandOptionType.Subcommand
	}],
	dm_permission: true
};
