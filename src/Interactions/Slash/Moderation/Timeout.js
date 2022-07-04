import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'timeout',
	description: 'Timeout a member with duration and optional reason.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'member',
		description: 'Member to timeout.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'duration',
		description: 'Duration of the timeout. (Example: 2d for 2 days)',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the timeout.',
		type: ApplicationCommandOptionType.String,
		max_length: 500,
		required: false
	}],
	default_member_permissions: new PermissionsBitField(['ModerateMembers']).bitfield.toString(),
	dm_permission: false
};
