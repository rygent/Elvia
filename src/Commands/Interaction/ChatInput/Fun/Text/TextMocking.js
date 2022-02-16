const Interaction = require('../../../../../Structures/Interaction');
const { spongeMock } = require('spongemock');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'text',
			subCommand: 'mocking',
			description: 'Applies spongemock effect to your text.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: spongeMock(text) });
	}

};
