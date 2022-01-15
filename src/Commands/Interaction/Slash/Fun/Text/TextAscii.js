const Interaction = require('../../../../../Structures/Interaction.js');
const { Formatters } = require('discord.js');
const figlet = require('util').promisify(require('figlet'));

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
		if (text.length > 20) return await interaction.reply({ content: 'Please enter text that is no longer than 20 characters!', ephemeral: true });

		return await interaction.reply({ content: Formatters.codeBlock(await figlet(text)) });
	}

};
