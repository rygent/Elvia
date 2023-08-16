import { ApplicationCommandType, type RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

export default {
	name: 'User Information',
	type: ApplicationCommandType.User,
	dm_permission: false
} as RESTPostAPIApplicationCommandsJSONBody;
