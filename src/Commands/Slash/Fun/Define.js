import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { fetch } from 'undici';
import Command from '../../../Structures/Interaction.js';
import { Colors } from '../../../Utils/Constants.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['define'],
			description: 'Define a word.'
		});
	}

	async run(interaction) {
		const word = interaction.options.getString('word', true);

		const raw = await fetch(`https://api.urbandictionary.com/v0/define?page=1&term=${encodeURIComponent(word)}`, { method: 'GET' });
		const response = await raw.json().then(({ list }) => list.sort((a, b) => b.thumbs_up - a.thumbs_up)[0]);

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(response.permalink));

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: 'Urban Dictionary', iconURL: 'https://i.imgur.com/qjkcwXu.png', url: 'https://urbandictionary.com/' })
			.setTitle(response.word)
			.setDescription(response.definition)
			.addFields({ name: '__Example__', value: response.example, inline: false })
			.setFooter({ text: `Powered by Urban Dictionary`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

}
