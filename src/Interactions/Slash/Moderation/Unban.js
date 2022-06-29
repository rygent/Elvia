import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'unban',
	description: 'Unban a user with optional reason.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to unban. (Username or User ID)',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the unban.',
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	default_member_permissions: new PermissionsBitField(['BanMembers']).bitfield.toString(),
	dm_permission: false
};
