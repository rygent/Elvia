import { ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'help',
	description: 'View help.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: true
};
