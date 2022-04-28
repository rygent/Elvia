/* eslint-disable camelcase */
const { ApplicationCommandType } = require('discord-api-types/v9');

module.exports = [{
	name: 'Avatar',
	type: ApplicationCommandType.User,
	dm_permission: false
}, {
	name: 'Translate',
	type: ApplicationCommandType.Message,
	dm_permission: true
}];
