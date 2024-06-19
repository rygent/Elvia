import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'execute',
	description: 'Executes any Bash command.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'bash',
			description: 'Bash command to execute.',
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: 'visible',
			description: 'Whether the replies should be visible in the channel.',
			type: ApplicationCommandOptionType.Boolean,
			required: false
		}
	],
	default_member_permissions: '0',
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild]
} as RESTPostAPIApplicationCommandsJSONBody;
