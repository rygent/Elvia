import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';

export default {
	name: 'nsfw',
	description: 'Displays explicit content.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'category',
		description: 'The category of content.',
		type: ApplicationCommandOptionType.String,
		autocomplete: true,
		required: true
	}, {
		name: 'ephemeral',
		description: 'Whether the message should be visibled ephemerally.',
		type: ApplicationCommandOptionType.Boolean,
		required: false
	}],
	dm_permission: true,
	nsfw: true
};
