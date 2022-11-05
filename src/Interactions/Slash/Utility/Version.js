import { ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'version',
	description: 'View information of the bot.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: true
};
