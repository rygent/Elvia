import { APIApplicationCommand, APIApplicationCommandOption, ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';

export default {
	name: 'execute',
	description: 'Executes any Bash command.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'bash',
		description: 'Bash command to execute.',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: 'visible',
		description: 'Whether the replies should be visible in the channel.',
		type: ApplicationCommandOptionType.Boolean,
		required: false
	}] as APIApplicationCommandOption[],
	default_member_permissions: '0',
	dm_permission: false
} as APIApplicationCommand;
