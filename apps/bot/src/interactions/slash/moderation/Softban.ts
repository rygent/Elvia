import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'softban',
	description: "Softban a user. (Bans and unbans to clear up the user's messages.)",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'user',
			description: 'User to softban.',
			type: ApplicationCommandOptionType.User,
			required: true
		},
		{
			name: 'reason',
			description: 'Reason of the softban.',
			type: ApplicationCommandOptionType.String,
			max_length: 500,
			required: false
		},
		{
			name: 'days',
			description: 'Number of days to delete messages for.',
			type: ApplicationCommandOptionType.Integer,
			choices: [
				{
					name: '0 days. (default)',
					value: 0
				},
				{
					name: '1 day.',
					value: 1
				},
				{
					name: '2 days.',
					value: 2
				},
				{
					name: '3 days.',
					value: 3
				},
				{
					name: '4 days.',
					value: 4
				},
				{
					name: '5 days.',
					value: 5
				},
				{
					name: '6 days.',
					value: 6
				},
				{
					name: '7 days.',
					value: 7
				}
			],
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
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild]
} as RESTPostAPIApplicationCommandsJSONBody;
