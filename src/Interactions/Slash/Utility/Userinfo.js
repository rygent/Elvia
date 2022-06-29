import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';

export default {
	name: 'userinfo',
	description: 'Get user information.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to get.',
		type: ApplicationCommandOptionType.User,
		required: false
	}],
	dm_permission: false
};
