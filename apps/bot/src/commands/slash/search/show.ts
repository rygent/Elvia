import { CoreClient, CoreCommand } from '@elvia/core';
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
import type { ChatInputCommandInteraction, StringSelectMenuInteraction } from 'discord.js';
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
			name: 'show',
			description: 'Search for a TV Show on TMDb.',
			options: [
				{
					name: 'search',
					description: 'Your search.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		const response = await axios
			.get(`https://api.themoviedb.org/3/search/tv?api_key=${env.TMDB_API_KEY}&query=${search}`)
			.then(({ data }) => data.results.slice(0, 10));

		if (!response.length) {
			return interaction.reply({ content: 'Nothing found for this search.', flags: MessageFlags.Ephemeral });
		}

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`I found ${bold(response.length.toString())} possible matches, please select one of the following:`
				)
			)
			.addActionRowComponents(
				new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
					new StringSelectMenuBuilder()
						.setCustomId(nanoid())
						.setPlaceholder('Select a shows')
						.setOptions(
							...response.map((data: any) => ({
								value: data.id.toString(),
								label: `${cutText(data.name, 97)} ${
									data.first_air_date ? `(${new Date(data.first_air_date).getFullYear()})` : ''
								}`,
								...(data.overview && { description: cutText(data.overview, 1e2) })
							}))
						)
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('TMDb')}`)));

		const reply = await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });

		const filter = (i: StringSelectMenuInteraction) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({
			filter,
			componentType: ComponentType.StringSelect,
			time: 6e4,
			max: 1
		});

		collector.on('ignore', (i) => void i.deferUpdate());
		collector.on('collect', async (i) => {
			const [ids] = i.values;
			const data = await axios
				.get(`https://api.themoviedb.org/3/tv/${ids}?api_key=${env.TMDB_API_KEY}`)
				.then((res) => res.data);

			const section = new SectionBuilder()
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						[
							heading(hyperlink(data.name, `https://www.themoviedb.org/tv/${data.id}`), 2),
							...(data.overview ? [data.overview] : [])
						].join('\n')
					)
				)
				.setThumbnailAccessory(new ThumbnailBuilder().setURL(`https://image.tmdb.org/t/p/original${data.poster_path}`));
			container.spliceComponents(0, 1, section);

			const detail = new TextDisplayBuilder().setContent(
				[
					`${bold('Genre:')} ${formatArray(data.genres.map(({ name }: any) => name.replace(/ &/, ',')))}`,
					...(data.vote_average
						? [`${bold('Rating:')} ${data.vote_average.toFixed(2)} (by ${formatNumber(data.vote_count)} users)`]
						: []),
					`${bold('Status:')} ${data.status}`,
					...(data.first_air_date ? [`${bold('Aired:')} ${getDate(data.first_air_date, data.last_air_date)}`] : []),
					...(data.episode_run_time?.length ? [`${bold('Runtime:')} ${getRuntime(data.episode_run_time[0])}`] : []),
					...(data.number_of_seasons ? [`${bold('Total seasons:')} ${data.number_of_seasons}`] : []),
					...(data.number_of_episodes ? [`${bold('Total episodes:')} ${data.number_of_episodes}`] : []),
					...(data.production_companies?.length
						? [`${bold('Studio:')} ${formatArray(data.production_companies.map(({ name }: any) => name))}`]
						: []),
					...(data.networks?.length
						? [`${bold('Networks:')} ${formatArray(data.networks.map(({ name }: any) => name))}`]
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

function getDate(startDate: number, endDate: number) {
	if (startDate && !endDate) return `${moment(new Date(startDate)).format('MMM D, YYYY')} to ?`;
	return `${moment(new Date(startDate)).format('MMM D, YYYY')} to ${moment(new Date(endDate)).format('MMM D, YYYY')}`;
}
