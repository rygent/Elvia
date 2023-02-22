import { APIApplicationCommand, APIApplicationCommandOption, ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';
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
		description: 'Number of days to delete messages for.',
		type: ApplicationCommandOptionType.Integer,
		choices: [{
			name: '0 days. (default)',
			value: 0
		}, {
			name: '1 day.',
			value: 1
		}, {
			name: '2 days.',
			value: 2
		}, {
			name: '3 days.',
			value: 3
		}, {
			name: '4 days.',
			value: 4
		}, {
			name: '5 days.',
			value: 5
		}, {
			name: '6 days.',
			value: 6
		}, {
			name: '7 days.',
			value: 7
		}],
		required: false
	}, {
		name: 'notify',
		description: 'Notify the user with a DM.',
		type: ApplicationCommandOptionType.String,
		choices: [{
			name: 'Notify with the reason.',
			value: 'notify-with-reason'
		}, {
			name: 'Notify without the reason.',
			value: 'notify-without-reason'
		}, {
			name: 'Don\'t notify. (default)',
			value: 'dont-notify'
		}],
		required: false
	}, {
		name: 'visible',
		description: 'Whether the replies should be visible in the channel.',
		type: ApplicationCommandOptionType.Boolean,
		required: false
	}] as APIApplicationCommandOption[],
	default_member_permissions: new PermissionsBitField(['BanMembers']).bitfield.toString(),
	dm_permission: false
} as APIApplicationCommand;
