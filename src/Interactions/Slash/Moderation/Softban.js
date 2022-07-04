import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'softban',
	description: "Softban a user. (Bans and unbans to clear up the user's messages.)",
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to softban.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the softban.',
		type: ApplicationCommandOptionType.String,
		max_length: 500,
		required: false
	}, {
		name: 'days',
		description: 'Number of days to delete messages for.',
		type: ApplicationCommandOptionType.Integer,
		choices: [{
			name: '0 days',
			value: 0
		}, {
			name: '1 day (default)',
			value: 1
		}, {
			name: '2 days',
			value: 2
		}, {
			name: '3 days',
			value: 3
		}, {
			name: '4 days',
			value: 4
		}, {
			name: '5 days',
			value: 5
		}, {
			name: '6 days',
			value: 6
		}, {
			name: '7 days',
			value: 7
		}],
		required: false
	}],
	default_member_permissions: new PermissionsBitField(['BanMembers']).bitfield.toString(),
	dm_permission: false
};
