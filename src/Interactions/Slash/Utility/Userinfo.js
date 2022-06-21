const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');

module.exports = {
	name: 'userinfo',
	description: 'Get user information.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to get.',
		type: ApplicationCommandOptionType.User,
		required: false
	}],
	dm_permission: false
};
