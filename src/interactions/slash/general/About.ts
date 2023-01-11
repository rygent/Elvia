import { APIApplicationCommand, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'about',
	description: 'Get information of the bot.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: true
} as APIApplicationCommand;
