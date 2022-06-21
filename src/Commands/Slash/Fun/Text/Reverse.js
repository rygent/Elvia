const Command = require('../../../../Structures/Interaction');
const { reverse } = require('../../../../Utils/Function');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['text', 'reverse'],
			description: 'Reverse your text.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: reverse(text) });
	}

};
