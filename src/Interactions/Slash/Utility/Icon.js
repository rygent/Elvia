import { ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'icon',
	description: 'Display the server icon.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: false
};
