const Interaction = require('../../../../Structures/Interaction.js');
const Answer = require('../../../../../assets/json/8ball.json');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: '8ball',
			description: 'Ask the magic 8ball a question.'
		});
	}

	async run(interaction) {
		const question = await interaction.options.getString('question', true);

		const Choice = Answer[Math.floor(Math.random() * Answer.length).toString(10)];

		return await interaction.reply({ content: [
			`🎱 ${question}`,
			`> ${Choice.Message}`
		].join('\n') });
	}

};
