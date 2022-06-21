const Command = require('../../../Structures/Interaction');
const { fetch } = require('undici');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['advice'],
			description: 'Get a random advice.'
		});
	}

	async run(interaction) {
		const raw = await fetch('https://api.adviceslip.com/advice', { method: 'GET' });
		const response = await raw.json();

		return interaction.reply({ content: response.slip.advice });
	}

};
