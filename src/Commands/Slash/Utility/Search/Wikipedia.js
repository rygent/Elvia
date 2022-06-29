import Command from '../../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { Colors } from '../../../../Utils/Constants.js';
import { fetch } from 'undici';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['search', 'wikipedia'],
			description: 'Search for something on Wikipedia.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);

		const raw = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(search)}`, { method: 'GET' });
		if (raw.status === 404) return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });

		const response = await raw.json();

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(response.content_urls.desktop.page));

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: 'Wikipedia', iconURL: 'https://i.imgur.com/a4eeEhh.png', url: 'https://en.wikipedia.org/' })
			.setTitle(response.title)
			.setThumbnail(response.originalimage?.source)
			.setDescription(response.extract)
			.setFooter({ text: `Powered by Wikipedia`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

}
