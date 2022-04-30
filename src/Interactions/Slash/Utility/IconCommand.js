const { ApplicationCommandType } = require('discord-api-types/v10');

module.exports = {
	name: 'icon',
	description: 'Display the server icon.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: false
};
