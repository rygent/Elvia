import { Client, Command } from '@elvia/tesseract';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	ComponentType,
	InteractionContextType
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction, StringSelectMenuInteraction } from 'discord.js';
import { bold, italic, underline } from '@discordjs/formatters';
import { Colors, UserAgent } from '@/lib/utils/Constants.js';
import { formatArray, formatNumber } from '@/lib/utils/Functions.js';
import { Env } from '@/lib/Env.js';
import { DurationFormatter } from '@sapphire/time-utilities';
import { cutText } from '@sapphire/utilities';
import { nanoid } from 'nanoid';
import { request } from 'undici';
import moment from 'moment';

export default class extends Command {
	public constructor(client: Client<true>) {
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
			defaultMemberPermissions: null,
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		const raw = await request(`https://api.themoviedb.org/3/search/tv?api_key=${Env.TmdbApiKey}&query=${search}`, {
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
			const data: any = await request(`https://api.themoviedb.org/3/tv/${ids}?api_key=${Env.TmdbApiKey}`, {
				method: 'GET',
				headers: { 'User-Agent': UserAgent },
				maxRedirections: 20
			}).then(({ body }) => body.json());

			const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(`https://www.themoviedb.org/tv/${data.id}`)
			);

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({
					name: 'The Movie Database',
					iconURL: 'https://i.imgur.com/F9tD6x9.png',
					url: 'https://www.themoviedb.org'
				})
				.setTitle(data.name)
				.setDescription(data.overview ? cutText(data.overview, 512) : null)
				.setThumbnail(`https://image.tmdb.org/t/p/original${data.poster_path}`)
				.addFields({
					name: underline(italic('Detail')),
					value: [
						`${bold(italic('Genre:'))} ${formatArray(data.genres.map(({ name }: any) => name.replace(/ &/, ',')))}`,
						...(data.vote_average
							? [
									`${bold(italic('Rating:'))} ${data.vote_average.toFixed(2)} (by ${formatNumber(
										data.vote_count
									)} users)`
								]
							: []),
						`${bold(italic('Status:'))} ${data.status}`,
						...(data.first_air_date
							? [`${bold(italic('Aired:'))} ${getDate(data.first_air_date, data.last_air_date)}`]
							: []),
						...(data.episode_run_time?.length
							? [`${bold(italic('Runtime:'))} ${getRuntime(data.episode_run_time[0])}`]
							: []),
						...(data.number_of_seasons ? [`${bold(italic('Total seasons:'))} ${data.number_of_seasons}`] : []),
						...(data.number_of_episodes ? [`${bold(italic('Total episodes:'))} ${data.number_of_episodes}`] : []),
						...(data.production_companies?.length
							? [`${bold(italic('Studio:'))} ${formatArray(data.production_companies.map(({ name }: any) => name))}`]
							: []),
						...(data.networks?.length
							? [`${bold(italic('Networks:'))} ${formatArray(data.networks.map(({ name }: any) => name))}`]
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

function getDate(startDate: number, endDate: number) {
	if (startDate && !endDate) return `${moment(new Date(startDate)).format('MMM D, YYYY')} to ?`;
	return `${moment(new Date(startDate)).format('MMM D, YYYY')} to ${moment(new Date(endDate)).format('MMM D, YYYY')}`;
}
