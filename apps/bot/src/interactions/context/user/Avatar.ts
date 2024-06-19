import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export default {
	name: 'Avatar',
	type: ApplicationCommandType.User,
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild]
} as RESTPostAPIApplicationCommandsJSONBody;
