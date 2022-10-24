import Command from '../../../Structures/Interaction.js';
import { fetch } from 'undici';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['8ball'],
			description: 'Ask the magic 8ball a question.'
		});
	}

	async run(interaction) {
		const question = interaction.options.getString('question', true);

		const raw = await fetch(`https://8ball.delegator.com/magic/JSON/${encodeURIComponent(question)}`, { method: 'GET' });
		const response = await raw.json().then(({ magic }) => magic);

		const replies = [
			`> **${interaction.user.username}**: ${response.question}`,
			`🎱 ${response.answer}`
		].join('\n');

		return interaction.reply({ content: replies });
	}

}
