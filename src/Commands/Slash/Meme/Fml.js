import Command from '../../../Structures/Interaction.js';
import { fetch } from 'undici';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['meme', 'fml'],
			description: 'Get a random F My Life story.'
		});
	}

	async run(interaction) {
		const language = interaction.options.getString('language') || 'en';

		const raw = await fetch(`https://blague.xyz/api/vdm/random?lang=${language}`, { method: 'GET' });
		const response = await raw.json();

		return interaction.reply({ content: response.vdm.content });
	}

}
