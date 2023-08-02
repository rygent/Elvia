import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';
import { Colors, UserAgent } from '#lib/utils/Constants.js';
import { request } from 'undici';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'search wikipedia',
			description: 'Search for something on Wikipedia.',
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		const raw = await request(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(search)}`, {
			method: 'GET',
			headers: { 'User-Agent': UserAgent },
			maxRedirections: 20
		});

		if (raw.statusCode === 404) {
			return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
		}

		const response = await raw.body.json();

		const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(response.content_urls.desktop.page)
		);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: 'Wikipedia', iconURL: 'https://i.imgur.com/a4eeEhh.png', url: 'https://en.wikipedia.org/' })
			.setTitle(response.title)
			.setThumbnail(response.originalimage?.source)
			.setDescription(response.extract)
			.setFooter({ text: `Powered by Wikipedia`, iconURL: interaction.user.avatarURL() as string });

		return interaction.reply({ embeds: [embed], components: [button] });
	}
}
