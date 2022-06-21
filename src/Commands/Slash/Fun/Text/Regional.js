const Command = require('../../../../Structures/Interaction');
const { regional } = require('../../../../Utils/Function');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['text', 'regional'],
			description: 'Transform your text to regional indicators.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: regional(text) });
	}

};
