const Interaction = require('../../../../../Structures/Interaction');
const { Formatters } = require('discord.js');
const { promisify } = require('node:util');
const figlet = promisify(require('figlet'));

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'text',
			subCommand: 'ascii',
			description: 'Transform your text to ascii characters.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);
		if (text.length > 20) return interaction.reply({ content: 'Please enter text that is no longer than 20 characters!', ephemeral: true });

		return interaction.reply({ content: Formatters.codeBlock(await figlet(text)) });
	}

};
