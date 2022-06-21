const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');

module.exports = {
	name: 'imgur',
	description: 'Upload a media to Imgur.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'media',
		description: 'Media to upload.',
		type: ApplicationCommandOptionType.Attachment,
		required: true
	}],
	dm_permission: true
};
