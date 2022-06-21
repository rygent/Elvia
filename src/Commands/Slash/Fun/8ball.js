const Command = require('../../../Structures/Interaction');
const Answer = require('../../../Assets/json/8ball.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['8ball'],
			description: 'Ask the magic 8ball a question.'
		});
	}

	async run(interaction) {
		const question = await interaction.options.getString('question', true);

		const choice = Answer[Math.floor(Math.random() * Answer.length)];

		const content = [
			`> **${interaction.user.username}**: ${question}`,
			`🎱 ${choice}`
		].join('\n');

		return interaction.reply({ content });
	}

};
