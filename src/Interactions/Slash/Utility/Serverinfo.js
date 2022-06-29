import { ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'serverinfo',
	description: 'Get server information.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: false
};
