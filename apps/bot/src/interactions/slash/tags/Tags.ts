import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'tags',
	description: 'Use tags commands.',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'create',
			description: 'Create a new server tag.',
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: 'delete',
			description: 'Delete an existing server tag.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'name',
					description: 'The tag name to delete.',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				}
			]
		},
		{
			name: 'edit',
			description: 'Edit an existing server tag.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'name',
					description: 'The tag name to edit.',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				}
			]
		},
		{
			name: 'pin',
			description: 'Pin an existing server tag.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'name',
					description: 'The tag name to pin.',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				}
			]
		},
		{
			name: 'rename',
			description: 'Rename an existing server tag.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'name',
					description: 'The tag name to rename.',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				}
			]
		},
		{
			name: 'reset',
			description: 'Reset all server tags.',
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: 'unpin',
			description: 'Unpin an existing server tag.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'name',
					description: 'The tag name to unpin.',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				}
			]
		}
	],
	default_member_permissions: new PermissionsBitField(['ManageGuild']).bitfield.toString(),
	integration_types: [ApplicationIntegrationType.GuildInstall],
	contexts: [InteractionContextType.Guild]
} as RESTPostAPIApplicationCommandsJSONBody;
