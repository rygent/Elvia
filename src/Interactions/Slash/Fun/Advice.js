const { ApplicationCommandType } = require('discord-api-types/v10');

module.exports = {
	name: 'advice',
	description: 'Get a random advice.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: true
};
