import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';

export default {
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
