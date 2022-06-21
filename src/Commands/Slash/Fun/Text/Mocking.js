const Command = require('../../../../Structures/Interaction');
const { spongemock } = require('../../../../Utils/Function');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['text', 'mocking'],
			description: 'Applies spongemock effect to your text.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: spongemock(text) });
	}

};
