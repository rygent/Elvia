import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'imgur',
	description: 'Upload a media to Imgur.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'media',
			description: 'Media to upload.',
			type: ApplicationCommandOptionType.Attachment,
			required: true
		},
		{
			name: 'visible',
			description: 'Whether the replies should be visible in the channel.',
			type: ApplicationCommandOptionType.Boolean,
			required: false
		}
	],
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]
} as RESTPostAPIApplicationCommandsJSONBody;
