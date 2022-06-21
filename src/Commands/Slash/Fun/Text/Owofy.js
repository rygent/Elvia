const Command = require('../../../../Structures/Interaction');
const { owofy } = require('../../../../Utils/Function');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['text', 'owofy'],
			description: 'Transform your text into owo and uwu.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: owofy(text) });
	}

};
