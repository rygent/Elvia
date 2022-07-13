import { EmbedBuilder } from '@discordjs/builders';
import { fetch } from 'undici';
import Command from '../../../Structures/Interaction.js';
import { Colors } from '../../../Utils/Constants.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['meme', 'random'],
			description: 'Displays random memes.'
		});
	}

	async run(interaction) {
		const raw = await fetch('https://apis.duncte123.me/meme', { method: 'GET' });
		const response = await raw.json();

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setImage(response.data.image)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

}
