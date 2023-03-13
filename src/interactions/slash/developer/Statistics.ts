import { APIApplicationCommand, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'statistics',
	description: 'Get statistics of the bot.',
	type: ApplicationCommandType.ChatInput,
	default_member_permissions: '0',
	dm_permission: false
} as APIApplicationCommand;
