import Command from '../../../../Structures/Interaction.js';
import { EmbedBuilder } from '@discordjs/builders';
import { Colors } from '../../../../Utils/Constants.js';
import { fetch } from 'undici';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['interact', 'bite'],
			description: 'Bite someone.'
		});
	}

	async run(interaction) {
		const member = interaction.options.getMember('user');

		const raw = await fetch(`https://api.waifu.pics/sfw/bite`, { method: 'GET' });
		const response = await raw.json();

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(`${member.toString()}, you're getting bitten by ${interaction.user.toString()}.`)
			.setImage(response.url)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

}
