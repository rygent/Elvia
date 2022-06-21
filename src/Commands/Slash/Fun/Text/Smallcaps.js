const Command = require('../../../../Structures/Interaction');
const { smallcaps } = require('../../../../Utils/Function');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['text', 'smallcaps'],
			description: 'Transform your text into small caps.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: smallcaps(text) });
	}

};
