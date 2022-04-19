const InteractionCommand = require('../../../../../Structures/Interaction');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['text', 'reverse'],
			description: 'Reverse your text.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		const converted = text.split('').reverse().join('');

		return interaction.reply({ content: converted });
	}

};
