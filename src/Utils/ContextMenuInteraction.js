const { ApplicationCommandType } = require('discord-api-types/v9');

module.exports = [{
	name: 'Avatar',
	type: ApplicationCommandType.User
}, {
	name: 'Translate',
	type: ApplicationCommandType.Message
}];
