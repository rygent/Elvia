import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'untimeout',
	description: 'Remove timeout from a member.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'member',
			description: 'Member to remove timeout from.',
			type: ApplicationCommandOptionType.User,
			required: true
		},
		{
			name: 'reason',
			description: 'Reason of the timeout removal.',
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
	default_member_permissions: new PermissionsBitField(['ModerateMembers']).bitfield.toString(),
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild]
} as RESTPostAPIApplicationCommandsJSONBody;
