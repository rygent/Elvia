const { ApplicationCommandType } = require('discord-api-types/v10');

module.exports = {
	name: 'ping',
	description: 'Send a ping request.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: true
};
