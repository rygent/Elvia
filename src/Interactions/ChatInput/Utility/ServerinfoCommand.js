const { ApplicationCommandType } = require('discord-api-types/v10');

module.exports = {
	name: 'serverinfo',
	description: 'Get server information.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: false
};
