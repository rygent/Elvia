import { APIApplicationCommand, APIApplicationCommandOption, ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'kick',
	description: 'Kick a member with optional reason.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'member',
		description: 'Member to kick.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the kick.',
		type: ApplicationCommandOptionType.String,
		max_length: 500,
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
		name: 'ephemeral',
		description: 'Whether the replies should be visible privately.',
		type: ApplicationCommandOptionType.Boolean,
		required: false
	}] as APIApplicationCommandOption[],
	default_member_permissions: new PermissionsBitField(['KickMembers']).bitfield.toString(),
	dm_permission: false
} as APIApplicationCommand;
