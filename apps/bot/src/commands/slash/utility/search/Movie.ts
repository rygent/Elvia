import type { BaseClient } from '#lib/structures/BaseClient.js';
import { Interaction } from '#lib/structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import type { ChatInputCommandInteraction, StringSelectMenuInteraction } from 'discord.js';
import { bold, hyperlink, italic, underscore } from '@discordjs/formatters';
import { Colors, UserAgent } from '#lib/utils/Constants.js';
import { formatArray, formatNumber } from '#lib/utils/Function.js';
import { Env } from '@aviana/env';
import { DurationFormatter } from '@sapphire/time-utilities';
import { cutText } from '@sapphire/utilities';
import { nanoid } from 'nanoid';
import { request } from 'undici';
import moment from 'moment';

export default class extends Interaction {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'search movie',
			description: 'Search for a Movie on TMDb.',
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		const raw = await request(`https://api.themoviedb.org/3/search/movie?api_key=${Env.TmdbApiKey}&query=${search}`, {
			method: 'GET',
			headers: { 'User-Agent': UserAgent },
			maxRedirections: 20
		});

		const response = await raw.body.json().then(({ results }: any) => results.slice(0, 10));
		if (!response.length) return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });

		const selectId = nanoid();
		const select = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setCustomId(selectId)
				.setPlaceholder('Select a movies')
				.setOptions(
					...response.map((data: any) => ({
						value: data.id.toString(),
						label: `${cutText(data.title, 97)} ${
							data.release_date ? `(${new Date(data.release_date).getFullYear()})` : ''
						}`,
						...(data.overview && { description: cutText(data.overview, 1e2) })
					}))
				)
		);

		const reply = await interaction.reply({
			content: `I found ${bold(response.length)} possible matches, please select one of the following:`,
			components: [select]
		});

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
			const data: any = await request(`https://api.themoviedb.org/3/movie/${ids}?api_key=${Env.TmdbApiKey}`, {
				method: 'GET',
				headers: { 'User-Agent': UserAgent },
				maxRedirections: 20
			}).then(({ body }) => body.json());

			const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(`https://www.themoviedb.org/movie/${data.id}`)
			);

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({
					name: 'The Movie Database',
					iconURL: 'https://i.imgur.com/F9tD6x9.png',
					url: 'https://www.themoviedb.org'
				})
				.setTitle(data.title)
				.setDescription(data.overview ? cutText(data.overview, 512) : null)
				.setThumbnail(`https://image.tmdb.org/t/p/original${data.poster_path}`)
				.addFields({
					name: underscore(italic('Detail')),
					value: [
						`${bold(italic('Genre:'))} ${formatArray(data.genres.map(({ name }: any) => name))}`,
						...(data.vote_average
							? [
									`${bold(italic('Rating:'))} ${data.vote_average.toFixed(2)} (by ${formatNumber(
										data.vote_count
									)} users)`
							  ]
							: []),
						`${bold(italic('Status:'))} ${data.status}`,
						...(data.release_date
							? [`${bold(italic('Released:'))} ${moment(new Date(data.release_date)).format('MMM D, YYYY')}`]
							: []),
						...(data.runtime ? [`${bold(italic('Runtime:'))} ${getRuntime(data.runtime)}`] : []),
						...(data.production_companies?.length
							? [`${bold(italic('Studio:'))} ${formatArray(data.production_companies.map(({ name }: any) => name))}`]
							: []),
						...(data.belongs_to_collection
							? [`${bold(italic('Collection:'))} ${data.belongs_to_collection.name}`]
							: []),
						...(data.imdb_id
							? [`${bold(italic('IMDb:'))} ${hyperlink('Click here', `http://www.imdb.com/title/${data.imdb_id}`)}`]
							: [])
					].join('\n'),
					inline: false
				})
				.setImage(`https://image.tmdb.org/t/p/original${data.backdrop_path}`)
				.setFooter({ text: 'Powered by The Movie Database', iconURL: interaction.user.avatarURL() as string });

			return void i.update({ content: null, embeds: [embed], components: [button] });
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
