import { APIApplicationCommand, APIApplicationCommandOption, ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'tags',
	description: 'Use tags commands.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'create',
		description: 'Create a new server tag.',
		type: ApplicationCommandOptionType.Subcommand
	}, {
		name: 'delete',
		description: 'Delete an existing server tag.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'name',
			description: 'The tag name to delete.',
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: true
		}]
	}, {
		name: 'edit',
		description: 'Edit an existing server tag.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'name',
			description: 'The tag name to edit.',
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: true
		}]
	}, {
		name: 'pin',
		description: 'Pin an existing server tag.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'name',
			description: 'The tag name to pin.',
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: true
		}]
	}, {
		name: 'rename',
		description: 'Rename an existing server tag.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'name',
			description: 'The tag name to rename.',
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: true
		}]
	}, {
		name: 'unpin',
		description: 'Unpin an existing server tag.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'name',
			description: 'The tag name to unpin.',
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: true
		}]
	}] as APIApplicationCommandOption[],
	default_member_permissions: new PermissionsBitField(['ManageGuild']).bitfield.toString(),
	dm_permission: false
} as APIApplicationCommand;
