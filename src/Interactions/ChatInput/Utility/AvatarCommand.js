const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');

module.exports = {
	name: 'avatar',
	description: 'Display the avatar of the provided user.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to display.',
		type: ApplicationCommandOptionType.User,
		required: false
	}]
};
