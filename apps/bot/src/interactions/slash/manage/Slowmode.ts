import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ChannelType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'slowmode',
	description: 'Applies a slowmode to a channel.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'duration',
			description: 'Duration of the slowmode. (Example: 2 hours)',
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: 'channel',
			description: 'Channel to set slowmode in. (Defaults to current channel)',
			type: ApplicationCommandOptionType.Channel,
			channel_types: [ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildForum],
			required: false
		},
		{
			name: 'reason',
			description: 'Reason of the slowmode.',
			type: ApplicationCommandOptionType.String,
			max_length: 500,
			required: false
		},
		{
			name: 'visible',
			description: 'Whether the replies should be visible in the channel.',
			type: ApplicationCommandOptionType.Boolean,
			required: false
		}
	],
	default_member_permissions: new PermissionsBitField(['ManageChannels']).bitfield.toString(),
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild]
} as RESTPostAPIApplicationCommandsJSONBody;
