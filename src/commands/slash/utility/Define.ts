import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';
import { italic, underscore } from '@discordjs/formatters';
import { Advances, Colors } from '#lib/utils/Constants.js';
import { request } from 'undici';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'define',
			description: 'Define a word.',
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const word = interaction.options.getString('word', true);

		const raw = await request(`https://api.urbandictionary.com/v0/define?page=1&term=${encodeURIComponent(word)}`, {
			method: 'GET',
			headers: { 'User-Agent': Advances.UserAgent },
			maxRedirections: 20
		});

		const response = await raw.body
			.json()
			.then(({ list }) => list.sort((a: any, b: any) => b.thumbs_up - a.thumbs_up)[0]);

		const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Open in Browser').setURL(response.permalink)
		);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({
				name: 'Urban Dictionary',
				iconURL: 'https://i.imgur.com/qjkcwXu.png',
				url: 'https://urbandictionary.com/'
			})
			.setTitle(response.word)
			.setDescription(response.definition)
			.addFields({ name: underscore(italic('Example')), value: response.example, inline: false })
			.setFooter({ text: `Powered by Urban Dictionary`, iconURL: interaction.user.avatarURL() as string });

		return interaction.reply({ embeds: [embed], components: [button] });
	}
}
