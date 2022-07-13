import Answer from '../../../Assets/json/8ball.json' assert { type: 'json' };
import Command from '../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['8ball'],
			description: 'Ask the magic 8ball a question.'
		});
	}

	async run(interaction) {
		const question = interaction.options.getString('question', true);

		const choice = Answer[Math.floor(Math.random() * Answer.length)];

		const content = [
			`> **${interaction.user.username}**: ${question}`,
			`🎱 ${choice}`
		].join('\n');

		return interaction.reply({ content });
	}

}
