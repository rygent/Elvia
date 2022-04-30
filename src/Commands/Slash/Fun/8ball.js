const InteractionCommand = require('../../../Structures/Interaction');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['8ball'],
			description: 'Ask the magic 8ball a question.'
		});
	}

	async run(interaction) {
		const question = await interaction.options.getString('question', true);

		const answer = require('../../../Assets/json/8ball.json');
		const choice = answer[Math.floor(Math.random() * answer.length)];

		const content = [
			`> **${interaction.user.username}**: ${question}`,
			`🎱 ${choice}`
		].join('\n');

		return interaction.reply({ content });
	}

};
