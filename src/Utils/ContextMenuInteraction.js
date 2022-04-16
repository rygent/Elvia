const { ApplicationCommandType } = require('discord-api-types/v10');

module.exports = [{
	name: 'Avatar',
	type: ApplicationCommandType.User
}, {
	name: 'Translate',
	type: ApplicationCommandType.Message
}];
