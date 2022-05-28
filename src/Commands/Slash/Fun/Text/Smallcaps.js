const InteractionCommand = require('../../../../Structures/Interaction');
const Function = require('../../../../Utils/Function');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['text', 'smallcaps'],
			description: 'Transform your text into small caps.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: Function.smallcaps(text) });
	}

};
