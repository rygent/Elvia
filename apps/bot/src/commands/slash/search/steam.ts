import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ComponentType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import {
	ActionRowBuilder,
	ContainerBuilder,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	SeparatorBuilder,
	StringSelectMenuBuilder,
	TextDisplayBuilder
} from '@discordjs/builders';
import { type ChatInputCommandInteraction, type StringSelectMenuInteraction } from 'discord.js';
import { bold, heading, hyperlink, inlineCode, italic, subtext } from '@discordjs/formatters';
import { formatArray, titleCase } from '@/lib/utils/functions.js';
import { nanoid } from 'nanoid';
import axios from 'axios';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'steam',
			description: 'Search for a Games on Steam.',
			options: [
				{
					name: 'search',
					description: 'Your search.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		const result = await axios
			.get(`https://store.steampowered.com/api/storesearch/?term=${search}&l=en&cc=us`)
			.then(({ data }) => data.items.filter((item: any) => item.type === 'app'));
		if (!result.length) {
			return interaction.reply({ content: 'Nothing found for this search.', flags: MessageFlags.Ephemeral });
		}

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`I found ${bold(result.length.toString())} possible matches, please select one of the following:`
				)
			)
			.addActionRowComponents(
				new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
					new StringSelectMenuBuilder()
						.setCustomId(nanoid())
						.setPlaceholder('Select a game')
						.setOptions(
							...result.map((data: any) => ({
								value: data.id.toString(),
								label: data.name
							}))
						)
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('Steam')}`)));

		const response = await interaction.reply({
			components: [container],
			flags: MessageFlags.IsComponentsV2,
			withResponse: true
		});

		const message = response.resource?.message;
		if (!message) return;

		const filter = (i: StringSelectMenuInteraction) => i.user.id === interaction.user.id;
		const collector = message.createMessageComponentCollector({
			filter,
			componentType: ComponentType.StringSelect,
			time: 6e4,
			max: 1
		});

		collector.on('ignore', (i) => void i.deferUpdate());
		collector.on('collect', async (i) => {
			const [ids] = i.values;

			const data = await axios
				.get(`https://store.steampowered.com/api/appdetails?appids=${ids}&l=en&cc=us`)
				.then((res) => res.data[ids!].data);

			const media = new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(data.header_image));
			container.spliceComponents(0, 1, media);

			const section = new TextDisplayBuilder().setContent(
				[
					heading(hyperlink(data.name, `https://store.steampowered.com/app/${data.steam_appid}/`), 2),
					data.short_description,
					...(data.content_descriptors?.notes
						? [`\n${italic(data.content_descriptors.notes.replace(/\r|\n/g, ''))}`]
						: [])
				].join('\n')
			);
			container.spliceComponents(1, 1, section);

			const detail = new TextDisplayBuilder().setContent(
				[
					`${bold('Release Date:')} ${data.release_date.coming_soon ? 'Coming soon' : data.release_date.date}`,
					`${bold('Price:')} ${inlineCode(data.price_overview ? data.price_overview.final_formatted : 'Free')}`,
					`${bold('Genres:')} ${data.genres.map(({ description }: any) => description).join(', ')}`,
					...(data.platforms
						? [
								`${bold('Platform:')} ${titleCase(
									formatArray(Object.keys(data.platforms).filter((item) => data.platforms[item]))
								).replace(/And/g, 'and')}`
							]
						: []),
					...(data.metacritic
						? [`${bold('Metascores:')} ${data.metacritic.score} from ${hyperlink('metacritic', data.metacritic.url)}`]
						: []),
					`${bold('Developers:')} ${data.developers.join(', ')}`,
					`${bold('Publishers:')} ${data.publishers.join(', ')}`
				].join('\n')
			);
			container.spliceComponents(2, 0, detail);

			return i.update({ components: [container], flags: MessageFlags.IsComponentsV2 });
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}
}
