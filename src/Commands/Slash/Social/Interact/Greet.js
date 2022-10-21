import Command from '../../../../Structures/Interaction.js';
import { EmbedBuilder } from '@discordjs/builders';
import { Colors } from '../../../../Utils/Constants.js';
import { fetch } from 'undici';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['interact', 'greet'],
			description: 'Greet someone.'
		});
	}

	async run(interaction) {
		const member = interaction.options.getMember('user');

		const raw = await fetch(`https://nekos.best/api/v2/wave`, { method: 'GET' });
		const response = await raw.json().then(({ results }) => results[0]);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(`${interaction.user.toString()} greets ${member.toString()}.`)
			.setImage(response.url)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

}
