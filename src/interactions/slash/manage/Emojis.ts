import { APIApplicationCommand, APIApplicationCommandOption, ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'emojis',
	description: 'Manage server emojis.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'add',
		description: 'Add an emoji to the server.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'name',
			description: 'The name of the emoji.',
			type: ApplicationCommandOptionType.String,
			min_length: 2,
			max_length: 32,
			required: true
		}, {
			name: 'emoji',
			description: 'The emoji to add. (Can be an existing emoji or a link)',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'delete',
		description: 'Delete a server emoji.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'emoji',
			description: 'The emoji to delete.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'rename',
		description: 'Rename a server emoji.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'emoji',
			description: 'The emoji to delete.',
			type: ApplicationCommandOptionType.String,
			required: true
		}, {
			name: 'name',
			description: 'The new name of the emoji.',
			type: ApplicationCommandOptionType.String,
			min_length: 2,
			max_length: 32,
			required: true
		}]
	}] as APIApplicationCommandOption[],
	default_member_permissions: new PermissionsBitField(['ManageEmojisAndStickers']).bitfield.toString(),
	dm_permission: false
} as APIApplicationCommand;
