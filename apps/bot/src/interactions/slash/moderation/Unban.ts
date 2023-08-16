import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'unban',
	description: 'Unban a user with optional reason.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'user',
			description: 'User to unban. (Username or User ID)',
			type: ApplicationCommandOptionType.User,
			required: true
		},
		{
			name: 'reason',
			description: 'Reason of the unban.',
			type: ApplicationCommandOptionType.String,
			max_length: 500,
			required: false
		},
		{
			name: 'notify',
			description: 'Notify the user with a DM.',
			type: ApplicationCommandOptionType.String,
			choices: [
				{
					name: 'Notify with the reason.',
					value: 'notify-with-reason'
				},
				{
					name: 'Notify without the reason.',
					value: 'notify-without-reason'
				},
				{
					name: "Don't notify. (default)",
					value: 'dont-notify'
				}
			],
			required: false
		},
		{
			name: 'visible',
			description: 'Whether the replies should be visible in the channel.',
			type: ApplicationCommandOptionType.Boolean,
			required: false
		}
	],
	default_member_permissions: new PermissionsBitField(['BanMembers']).bitfield.toString(),
	dm_permission: false
} as RESTPostAPIApplicationCommandsJSONBody;
