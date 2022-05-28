const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');

module.exports = {
	name: 'text',
	description: 'Manipulate your text.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'flip',
		description: 'Flip your text.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'text',
			description: 'Text to flip.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'mocking',
		description: 'Applies spongemock effect to your text.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'text',
			description: 'Text to mocking.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'owofy',
		description: 'Transform your text into owo and uwu.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'text',
			description: 'Text to transform.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'regional',
		description: 'Transform your text to regional indicators.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'text',
			description: 'Text to transform.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'reverse',
		description: 'Reverse your text.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'text',
			description: 'Text to reverse.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'smallcaps',
		description: 'Transform your text into small caps.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'text',
			description: 'Text to transform.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'vaporwave',
		description: 'Applies vaporwave effect to your text.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'text',
			description: 'Text to vaporwave.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}],
	dm_permission: true
};
