const InteractionCommand = require('../../../Structures/Interaction');
const { fetch } = require('undici');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['advice'],
			description: 'Get a random advice.'
		});
	}

	async run(interaction) {
		const body = await fetch('https://api.adviceslip.com/advice', { method: 'GET' });
		const response = await body.json();

		return interaction.reply({ content: response.slip.advice });
	}

};
