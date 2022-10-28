import Command from '../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { Colors } from '../../../Utils/Constants.js';
import { fetch } from 'undici';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['nsfw'],
			description: 'Display explicit content, from given categories.',
			nsfw: true
		});
	}

	async run(interaction) {
		const category = interaction.options.getString('category', true);
		const ephemeral = interaction.options.getBoolean('ephemeral');

		const data = require('../../../Assets/json/nsfw.json');
		if (!data.find(({ value }) => value === category)) {
			return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
		}

		await interaction.deferReply({ ephemeral });

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

		return interaction.editReply({ embeds: [embed], components: [button] });
	}

}
