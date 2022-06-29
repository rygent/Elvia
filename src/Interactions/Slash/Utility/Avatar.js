import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';

export default {
	name: 'avatar',
	description: 'Display the avatar of the provided user.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to display.',
		type: ApplicationCommandOptionType.User,
		required: false
	}],
	dm_permission: true
};
