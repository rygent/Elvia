import { type APIApplicationCommand, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'ping',
	description: 'Send a ping request.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: true
} as APIApplicationCommand;
