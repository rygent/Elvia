import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'timeout',
	description: 'Timeout a member with duration and optional reason.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'member',
			description: 'Member to timeout.',
			type: ApplicationCommandOptionType.User,
			required: true
		},
		{
			name: 'duration',
			description: 'Duration of the timeout. (Example: 2d for 2 days)',
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: 'reason',
			description: 'Reason of the timeout.',
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
	default_member_permissions: new PermissionsBitField(['ModerateMembers']).bitfield.toString(),
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild]
} as RESTPostAPIApplicationCommandsJSONBody;
