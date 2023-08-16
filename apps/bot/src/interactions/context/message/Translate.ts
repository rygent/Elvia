import { ApplicationCommandType, type RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

export default {
	name: 'Translate',
	type: ApplicationCommandType.Message,
	dm_permission: true
} as RESTPostAPIApplicationCommandsJSONBody;
