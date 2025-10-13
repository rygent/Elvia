import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import {
	ContainerBuilder,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	SectionBuilder,
	SeparatorBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder
} from '@discordjs/builders';
import { type AutocompleteInteraction, type ChatInputCommandInteraction } from 'discord.js';
import { bold, heading, hyperlink, subtext } from '@discordjs/formatters';
import { formatArray, formatNumber } from '@/lib/utils/functions.js';
import { fetcher } from '@/lib/fetcher.js';
import { DurationFormatter } from '@sapphire/time-utilities';
import { cutText } from '@sapphire/utilities';
import { env } from '@/env.js';
import moment from 'moment';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'tv-show',
			description: 'Search for a TV Show on TMDb.',
			options: [
				{
					name: 'query',
					description: 'Your query.',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const id = interaction.options.getString('query', true);

		const params = new URLSearchParams();
		params.append('api_key', env.TMDB_API_KEY);

		const respond = await fetcher(`https://api.themoviedb.org/3/tv/${id}?${params.toString()}`, {
			method: 'GET'
		}).catch(() => null);

		if (!respond) {
			return interaction.reply({ content: 'Nothing found for this query.', flags: MessageFlags.Ephemeral });
		}

		const container = new ContainerBuilder()
			.addSectionComponents(
				new SectionBuilder()
					.addTextDisplayComponents(
						new TextDisplayBuilder().setContent(
							[
								heading(hyperlink(respond.name, `https://www.themoviedb.org/tv/${respond.id}`), 2),
								...(respond.overview ? [respond.overview] : [])
							].join('\n')
						)
					)
					.setThumbnailAccessory(
						new ThumbnailBuilder().setURL(`https://image.tmdb.org/t/p/original${respond.poster_path}`)
					)
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						`${bold('Genre:')} ${formatArray(respond.genres.map(({ name }: any) => name.replace(/ &/, ',')))}`,
						...(respond.vote_average
							? [`${bold('Rating:')} ${respond.vote_average.toFixed(2)} (by ${formatNumber(respond.vote_count)} users)`]
							: []),
						`${bold('Status:')} ${respond.status}`,
						...(respond.first_air_date
							? [`${bold('Aired:')} ${getDate(respond.first_air_date, respond.last_air_date)}`]
							: []),
						...(respond.episode_run_time?.length
							? [`${bold('Runtime:')} ${getRuntime(respond.episode_run_time[0])}`]
							: []),
						...(respond.number_of_seasons ? [`${bold('Total seasons:')} ${respond.number_of_seasons}`] : []),
						...(respond.number_of_episodes ? [`${bold('Total episodes:')} ${respond.number_of_episodes}`] : []),
						...(respond.production_companies?.length
							? [`${bold('Studio:')} ${formatArray(respond.production_companies.map(({ name }: any) => name))}`]
							: []),
						...(respond.networks?.length
							? [`${bold('Networks:')} ${formatArray(respond.networks.map(({ name }: any) => name))}`]
							: [])
					].join('\n')
				)
			)
			.addMediaGalleryComponents(
				new MediaGalleryBuilder().addItems(
					new MediaGalleryItemBuilder().setURL(`https://image.tmdb.org/t/p/original${respond.backdrop_path}`)
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('TMDb')}`)));

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}

	public override async autocomplete(interaction: AutocompleteInteraction<'cached' | 'raw'>) {
		const focused = interaction.options.getFocused(true);

		const params = new URLSearchParams();
		params.append('api_key', env.TMDB_API_KEY);
		params.append('query', focused.value);

		const respond = await fetcher(`https://api.themoviedb.org/3/search/tv?${params.toString()}`, {
			method: 'GET'
		}).then((data) => data.results);

		if (!respond.length) return interaction.respond([]);

		const options = respond.map((data: any) => ({
			name: cutText(
				`${data.name} ${data.first_air_date ? `(${new Date(data.first_air_date).getFullYear()})` : ''}`.trim(),
				1e2
			),
			value: data.id.toString()
		}));

		return interaction.respond(options.slice(0, 25));
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
