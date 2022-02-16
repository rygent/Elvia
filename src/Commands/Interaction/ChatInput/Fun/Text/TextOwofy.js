const Interaction = require('../../../../../Structures/Interaction');
const owo = require('owofy');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'text',
			subCommand: 'owofy',
			description: 'Transform your text into owo and uwu.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: owo(text) });
	}

};
