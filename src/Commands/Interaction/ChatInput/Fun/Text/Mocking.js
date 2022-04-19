const InteractionCommand = require('../../../../../Structures/Interaction');
const { spongeMock } = require('spongemock');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['text', 'mocking'],
			description: 'Applies spongemock effect to your text.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: spongeMock(text) });
	}

};
