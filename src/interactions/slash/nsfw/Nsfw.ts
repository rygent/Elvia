import { APIApplicationCommand, APIApplicationCommandOption, ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'nsfw',
	description: 'Displays explicit content.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'category',
		description: 'Category of content.',
		type: ApplicationCommandOptionType.String,
		autocomplete: true,
		required: true
	}, {
		name: 'ephemeral',
		description: 'Whether the replies should be visible privately.',
		type: ApplicationCommandOptionType.Boolean,
		required: false
	}] as APIApplicationCommandOption[],
	nsfw: true,
	dm_permission: true
} as APIApplicationCommand;
