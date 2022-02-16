const Interaction = require('../../../../Structures/Interaction');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: '8ball',
			description: 'Ask the magic 8ball a question.'
		});
	}

	async run(interaction) {
		const question = await interaction.options.getString('question', true);

		const answer = require('../../../../Assets/json/8ball.json');
		const choice = answer[Math.floor(Math.random() * answer.length)];

		return interaction.reply({ content: [
			`> **${interaction.user.username}**: ${question}`,
			`🎱 ${choice}`
		].join('\n') });
	}

};
