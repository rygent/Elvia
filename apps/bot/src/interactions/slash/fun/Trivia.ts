import { ApplicationCommandType, type RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

export default {
	name: 'trivia',
	description: 'Plays a quick trivia game.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: true
} as RESTPostAPIApplicationCommandsJSONBody;
