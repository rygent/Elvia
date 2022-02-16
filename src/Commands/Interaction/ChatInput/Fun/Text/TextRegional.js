const Interaction = require('../../../../../Structures/Interaction');
const { convert } = require('discord-emoji-convert');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'text',
			subCommand: 'regional',
			description: 'Transform your text to regional indicators.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: convert(text) });
	}

};
