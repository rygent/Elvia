import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'ban',
	description: 'Ban a user with optional reason.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to ban.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the ban.',
		type: ApplicationCommandOptionType.String,
		max_length: 500,
		required: false
	}, {
		name: 'days',
		description: 'Number of days to delete messages for. (0-7)',
		type: ApplicationCommandOptionType.Integer,
		min_value: 0,
		max_value: 7,
		required: false
	}],
	default_member_permissions: new PermissionsBitField(['BanMembers']).bitfield.toString(),
	dm_permission: false
};
