import Command from '../../../../Structures/Interaction.js';
import { EmbedBuilder } from '@discordjs/builders';
import { Colors } from '../../../../Utils/Constants.js';
import { fetch } from 'undici';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['interact', 'stare'],
			description: 'Stare at someone.'
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user');

		const raw = await fetch(`https://nekoapi.vanillank2006.repl.co/api/action/stare`, { method: 'GET' });
		const response = await raw.json();

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(`${interaction.user.toString()} stares at ${member.toString()}.`)
			.setImage(response.url)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

}
