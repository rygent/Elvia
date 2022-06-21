const Command = require('../../../../Structures/Interaction');
const { vaporwave } = require('../../../../Utils/Function');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['text', 'vaporwave'],
			description: 'Transform your text into vaporwave.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: vaporwave(text) });
	}

};
