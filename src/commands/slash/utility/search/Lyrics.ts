import type BaseClient from '../../../../lib/BaseClient.js';
import Command from '../../../../lib/structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import type { ChatInputCommandInteraction, StringSelectMenuInteraction } from 'discord.js';
import { bold } from '@discordjs/formatters';
import { Colors, Credentials } from '../../../../lib/utils/Constants.js';
import { Client as Genius } from 'genius-lyrics';
import { cutText } from '@sapphire/utilities';
import { nanoid } from 'nanoid';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'search lyrics',
			description: 'Search for a lyrics on Genius.',
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		const genius = new Genius(Credentials.GeniusApiKey);
		const response = await genius.songs.search(search);

		const selectId = nanoid();
		const select = new ActionRowBuilder<StringSelectMenuBuilder>()
			.setComponents(new StringSelectMenuBuilder()
				.setCustomId(selectId)
				.setPlaceholder('Select a song')
				.setOptions(...response.map(data => ({
					value: data.id.toString(),
					label: cutText(data.title, 1e2),
					description: cutText(data.artist.name, 1e2)
				}))));

		const reply = await interaction.reply({ content: `I found ${bold(response.length.toString())} possible matches, please select one of the following:`, components: [select] });

		const filter = (i: StringSelectMenuInteraction) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.StringSelect, time: 6e4, max: 1 });

		collector.on('ignore', (i) => void i.deferUpdate());
		collector.on('collect', async (i) => {
			const [selected] = i.values;
			const data = response.find(item => item.id.toString() === selected)!;

			const lyrics = await data.lyrics();

			const button = new ActionRowBuilder<ButtonBuilder>()
				.setComponents(new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(data.url));

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Genius', iconURL: 'https://i.imgur.com/SkN6tBf.png', url: 'https://genius.com/' })
				.setTitle(`${data.title} - ${data.artist.name}`)
				.setThumbnail(data.image)
				.setDescription(lyrics)
				.setFooter({ text: 'Powered by Genius', iconURL: interaction.user.avatarURL() as string });

			return void i.update({ content: null, embeds: [embed], components: [button] });
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}
}
