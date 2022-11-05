import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';

export default {
	name: 'execute',
	description: 'Executes any Shell command.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'ephemeral',
		description: 'Whether the message should be visibled ephemerally.',
		type: ApplicationCommandOptionType.Boolean,
		required: false
	}],
	default_member_permissions: 0,
	dm_permission: false
};
