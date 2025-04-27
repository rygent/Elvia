import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	ComponentType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction, StringSelectMenuInteraction } from 'discord.js';
import { bold, hyperlink, italic, underline } from '@discordjs/formatters';
import { Colors } from '@/lib/utils/constants.js';
import { formatArray, formatNumber } from '@/lib/utils/functions.js';
import { env } from '@/env.js';
import { DurationFormatter } from '@sapphire/time-utilities';
import { cutText } from '@sapphire/utilities';
import { nanoid } from 'nanoid';
import axios from 'axios';
import moment from 'moment';

export default class extends Command {
	public constructor(client: Client<true>) {
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
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		const response = await axios
			.get(`https://api.themoviedb.org/3/search/movie?api_key=${env.TMDB_API_KEY}&query=${search}`)
			.then(({ data }) => data.results.slice(0, 10));

		if (!response.length) {
			return interaction.reply({ content: 'Nothing found for this search.', flags: MessageFlags.Ephemeral });
		}

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
			const data = await axios
				.get(`https://api.themoviedb.org/3/movie/${ids}?api_key=${env.TMDB_API_KEY}`)
				.then((res) => res.data);

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
					name: underline(italic('Detail')),
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
