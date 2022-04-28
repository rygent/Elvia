const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'emoji',
	description: 'Show an emoji or manage server emojis.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'image',
		description: 'Get the full size image of an emoji.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'emoji',
			description: 'The emoji to get.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'add',
		description: 'Add an emoji to the server.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'name',
			description: 'The name of the emoji.',
			type: ApplicationCommandOptionType.String,
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
			required: true
		}]
	}, {
		name: 'list',
		description: 'List server emojis.',
		type: ApplicationCommandOptionType.Subcommand
	}],
	default_member_permissions: new PermissionsBitField(['ManageEmojisAndStickers']).bitfield.toString(),
	dm_permission: false
};
