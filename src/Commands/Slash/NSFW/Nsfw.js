import Command from '../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { Colors } from '../../../Utils/Constants.js';
import { fetch } from 'undici';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['nsfw'],
			description: 'Displays explicit content.',
			nsfw: true
		});
	}

	async run(interaction) {
		const category = interaction.options.getString('category', true);
		const ephemeral = interaction.options.getBoolean('ephemeral');

		try {
			const raw = await fetch(`https://nekobot.xyz/api/image?type=${category}`, { method: 'GET' });
			const response = await raw.json();

			const button = new ActionRowBuilder()
				.addComponents(new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(response.message));

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setImage(response.message)
				.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

			return interaction.reply({ embeds: [embed], components: [button], ephemeral });
		} catch {
			return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
		}
	}

}
