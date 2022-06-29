import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';

export default {
	name: 'emoji',
	description: 'Show an emoji.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'image',
		description: 'Get the full size image of an emoji.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'emoji',
			description: 'The emoji to get.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'list',
		description: 'List server emojis.',
		type: ApplicationCommandOptionType.Subcommand
	}],
	dm_permission: false
};
