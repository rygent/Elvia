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
	SeparatorBuilder,
	TextDisplayBuilder
} from '@discordjs/builders';
import { type AutocompleteInteraction, type ChatInputCommandInteraction } from 'discord.js';
import { bold, heading, hyperlink, subtext, time } from '@discordjs/formatters';
import { formatArray, formatNumber, isNsfwChannel, titleCase } from '@/lib/utils/functions.js';
import { Anilist } from '@rygent/anilist';
import { DurationFormatter } from '@sapphire/time-utilities';
import { cutText } from '@sapphire/utilities';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'anime',
			description: 'Search for an Anime on Anilist.',
			options: [
				{
					name: 'query',
					description: 'Your query.',
					type: ApplicationCommandOptionType.Number,
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
		const id = interaction.options.getNumber('query', true);

		const anilist = new Anilist();
		const respond = await anilist.media.anime(id);
		if (respond.isAdult && !isNsfwChannel(interaction.channel)) {
			return interaction.reply({ content: `This anime contain adult content.`, flags: MessageFlags.Ephemeral });
		}

		const container = new ContainerBuilder()
			.addMediaGalleryComponents(
				new MediaGalleryBuilder().addItems(
					new MediaGalleryItemBuilder().setURL(`https://img.anili.st/media/${respond.id}`)
				)
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(heading(hyperlink(respond.title!.userPreferred!, respond.siteUrl!), 2))
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						...(respond.title?.romaji ? [`${bold('Romaji:')} ${respond.title.romaji}`] : []),
						...(respond.title?.english ? [`${bold('English:')} ${respond.title.english}`] : []),
						...(respond.title?.native ? [`${bold('Native:')} ${respond.title.native}`] : []),
						...(respond.format ? [`${bold('Type:')} ${getType(respond.format)}`] : []),
						...(respond.status ? [`${bold('Status:')} ${titleCase(respond.status.replace(/_/g, ' '))}`] : []),
						...(respond.source ? [`${bold('Source:')} ${titleCase(respond.source.replace(/_/g, ' '))}`] : []),
						...(respond.startDate ? [`${bold('Aired:')} ${getDate(respond.startDate, respond.endDate!)}`] : []),
						...(respond.duration
							? [`${bold('Length:')} ${getDurationLength(respond.duration, respond.episodes!, respond.format!)}`]
							: []),
						...(respond.nextAiringEpisode
							? [
									`${bold('Next episodes:')} ${time(respond.nextAiringEpisode.airingAt, 'R')} (episode ${
										respond.nextAiringEpisode.episode
									})`
								]
							: []),
						...(respond.isAdult ? [`${bold('Adult content:')} ${respond.isAdult ? 'Yes' : 'No'}`] : []),
						...(respond.popularity ? [`${bold('Popularity:')} ${formatNumber(respond.popularity)}`] : []),
						...(respond.characters?.length
							? [`${bold('Characters:')} ${formatArray(respond.characters.map((item) => item.name!.userPreferred!))}`]
							: []),
						...(respond.externalLinks?.filter((item) => item?.type === 'STREAMING')?.length
							? [
									`${bold('Networks:')} ${respond.externalLinks
										.filter((item) => item.type === 'STREAMING')
										.map((item) => hyperlink(item.site, item.url!))
										.join(', ')}`
								]
							: [])
					].join('\n')
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('Anilist')}`)));

		if (respond.description?.length) {
			const description = new TextDisplayBuilder().setContent(respond.description);
			container.spliceComponents(2, 0, description);
		}

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}

	public override async autocomplete(interaction: AutocompleteInteraction<'cached' | 'raw'>) {
		const focused = interaction.options.getFocused();

		const anilist = new Anilist();
		const respond = await anilist.media.search({ type: 'Anime', search: focused }).then((res) =>
			res.filter((data) => {
				if (data.isAdult && !isNsfwChannel(interaction.channel)) return false;
				return true;
			})
		);

		if (!respond.length) return interaction.respond([]);

		const options = respond.map((data) => ({
			name: cutText(data.title!.userPreferred!, 1e2),
			value: data.id
		}));

		return interaction.respond(options.slice(0, 25));
	}
}

function getType(format: string): string {
	if (['TV', 'OVA', 'ONA'].includes(format)) return format;
	else if (format === 'TV_SHORT') return 'TV Short';
	return titleCase(format.replace(/_/g, ' '));
}

function getDurationLength(duration: number, episodes: number, format: string): string | undefined {
	const formatter = (milliseconds: number) => new DurationFormatter().format(milliseconds, undefined, { right: ', ' });
	if (format === 'MOVIE') return `${formatter(duration * 6e4)} total (${duration} minutes)`;
	else if (episodes > 1) return `${formatter(duration * episodes * 6e4)} total (${duration} minutes each)`;
	else if (episodes <= 1 && format !== 'MOVIE') return `${duration} minutes`;
}

function getDate(startDate: string, endDate: string | null): string {
	if (startDate === endDate) return startDate;
	else if (startDate && !endDate) return `${startDate} to ?`;
	return `${startDate} to ${endDate}`;
}
