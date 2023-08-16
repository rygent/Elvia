import { ApplicationCommandType, type RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

export default {
	name: 'Avatar',
	type: ApplicationCommandType.User,
	dm_permission: false
} as RESTPostAPIApplicationCommandsJSONBody;
