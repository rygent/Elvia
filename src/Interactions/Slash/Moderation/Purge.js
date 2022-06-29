import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

export default {
	name: 'purge',
	description: 'Purge channel messages.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'messages',
		description: 'Purge messages in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'user',
		description: 'Purge user messages in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to delete messages.',
			type: ApplicationCommandOptionType.User,
			required: true
		}, {
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'bots',
		description: 'Purge bots messages in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'commands',
		description: 'Purge application commands messages in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'embeds',
		description: 'Purge messages that contain embeds in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'emojis',
		description: 'Purge messages that contain emojis in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'images',
		description: 'Purge messages that contain images in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'invites',
		description: 'Purge messages that contain invite links in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'links',
		description: 'Purge messages that contain links in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'mentions',
		description: 'Purge messages that contain mentions in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'reactions',
		description: 'Purge messages that contain reactions in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'text',
		description: 'Purge messages that contain text in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'match',
		description: 'Purge messages that match specified content in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'content',
			description: 'Content to match.',
			type: ApplicationCommandOptionType.String,
			required: true
		}, {
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'starts-with',
		description: 'Purge messages that starts with specified content in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'content',
			description: 'Content to match.',
			type: ApplicationCommandOptionType.String,
			required: true
		}, {
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'ends-with',
		description: 'Purge messages that ends with specified content in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'content',
			description: 'Content to match.',
			type: ApplicationCommandOptionType.String,
			required: true
		}, {
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}],
	default_member_permissions: new PermissionsBitField(['ManageMessages']).bitfield.toString(),
	dm_permission: false
};
