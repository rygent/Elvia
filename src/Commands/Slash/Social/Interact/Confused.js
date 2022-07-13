import { EmbedBuilder } from '@discordjs/builders';
import { fetch } from 'undici';
import Command from '../../../../Structures/Interaction.js';
import { Colors } from '../../../../Utils/Constants.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['interact', 'confused'],
			description: 'Someone made you confused.'
		});
	}

	async run(interaction) {
		const member = interaction.options.getMember('user');

		const raw = await fetch(`https://anime-reactions.uzairashraf.dev/api/reactions/random?category=confused`, { method: 'GET' });
		const response = await raw.json();

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(`${member.toString()} made ${interaction.user.toString()} confused.`)
			.setImage(response.reaction)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

}
