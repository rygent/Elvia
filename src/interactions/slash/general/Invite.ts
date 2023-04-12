import { type APIApplicationCommand, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'invite',
	description: 'Add the bot to another server.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: true
} as APIApplicationCommand;
