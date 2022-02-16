const Interaction = require('../../../../../Structures/Interaction');
const flip = require('flip-text');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'text',
			subCommand: 'flip',
			description: 'Flip your text.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: flip(text) });
	}

};
