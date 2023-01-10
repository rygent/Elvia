import { APIApplicationCommand, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'advice',
	description: 'Get a random advice.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: true
} as APIApplicationCommand;
