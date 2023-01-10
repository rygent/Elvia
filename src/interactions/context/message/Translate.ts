import { APIApplicationCommand, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'Translate',
	type: ApplicationCommandType.Message,
	dm_permission: true
} as APIApplicationCommand;
