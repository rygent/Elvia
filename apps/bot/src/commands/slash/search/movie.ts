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
	SectionBuilder,
	SeparatorBuilder,
	StringSelectMenuBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder
} from '@discordjs/builders';
import { type ChatInputCommandInteraction, type StringSelectMenuInteraction } from 'discord.js';
import { bold, heading, hyperlink, subtext } from '@discordjs/formatters';
import { formatArray, formatNumber } from '@/lib/utils/functions.js';
import { env } from '@/env.js';
import { DurationFormatter } from '@sapphire/time-utilities';
import { cutText } from '@sapphire/utilities';
import { nanoid } from 'nanoid';
import axios from 'axios';
import moment from 'moment';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'movie',
			description: 'Search for a Movie on TMDb.',
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
			.get(`https://api.themoviedb.org/3/search/movie?api_key=${env.TMDB_API_KEY}&query=${search}`)
			.then(({ data }) => data.results.slice(0, 10));

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
						.setPlaceholder('Select a movies')
						.setOptions(
							...result.map((data: any) => ({
								value: data.id.toString(),
								label: `${cutText(data.title, 97)} ${
									data.release_date ? `(${new Date(data.release_date).getFullYear()})` : ''
								}`,
								...(data.overview && { description: cutText(data.overview, 1e2) })
							}))
						)
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('TMDb')}`)));

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
				.get(`https://api.themoviedb.org/3/movie/${ids}?api_key=${env.TMDB_API_KEY}`)
				.then((res) => res.data);

			const section = new SectionBuilder()
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						[
							heading(hyperlink(data.title, `https://www.themoviedb.org/movie/${data.id}`), 2),
							...(data.overview ? [data.overview] : [])
						].join('\n')
					)
				)
				.setThumbnailAccessory(new ThumbnailBuilder().setURL(`https://image.tmdb.org/t/p/original${data.poster_path}`));
			container.spliceComponents(0, 1, section);

			const detail = new TextDisplayBuilder().setContent(
				[
					`${bold('Genre:')} ${formatArray(data.genres.map(({ name }: any) => name))}`,
					...(data.vote_average
						? [`${bold('Rating:')} ${data.vote_average.toFixed(2)} (by ${formatNumber(data.vote_count)} users)`]
						: []),
					`${bold('Status:')} ${data.status}`,
					...(data.release_date
						? [`${bold('Released:')} ${moment(new Date(data.release_date)).format('MMM D, YYYY')}`]
						: []),
					...(data.runtime ? [`${bold('Runtime:')} ${getRuntime(data.runtime)}`] : []),
					...(data.production_companies?.length
						? [`${bold('Studio:')} ${formatArray(data.production_companies.map(({ name }: any) => name))}`]
						: []),
					...(data.belongs_to_collection ? [`${bold('Collection:')} ${data.belongs_to_collection.name}`] : []),
					...(data.imdb_id
						? [`${bold('IMDb:')} ${hyperlink('Click here', `http://www.imdb.com/title/${data.imdb_id}`)}`]
						: [])
				].join('\n')
			);
			container.spliceComponents(1, 1, detail);

			const media = new MediaGalleryBuilder().addItems(
				new MediaGalleryItemBuilder().setURL(`https://image.tmdb.org/t/p/original${data.backdrop_path}`)
			);
			container.spliceComponents(2, 0, media);

			return i.update({ components: [container], flags: MessageFlags.IsComponentsV2 });
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') return interaction.deleteReply();
		});
	}
}

function getRuntime(runtime: number) {
	const formatter = (milliseconds: number) => new DurationFormatter().format(milliseconds, undefined, { right: ', ' });
	return `${formatter(runtime * 6e4)}`;
}
