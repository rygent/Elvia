import { APIApplicationCommand, APIApplicationCommandOption, ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'imgur',
	description: 'Upload a media to Imgur.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'media',
		description: 'Media to upload.',
		type: ApplicationCommandOptionType.Attachment,
		required: true
	}, {
		name: 'visible',
		description: 'Whether the replies should be visible in the channel.',
		type: ApplicationCommandOptionType.Boolean,
		required: false
	}] as APIApplicationCommandOption[],
	dm_permission: true
} as APIApplicationCommand;
