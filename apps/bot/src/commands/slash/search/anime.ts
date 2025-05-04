import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
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
import type { ChatInputCommandInteraction, StringSelectMenuInteraction } from 'discord.js';
import { bold, heading, hyperlink, subtext, time } from '@discordjs/formatters';
import { formatArray, formatNumber, isNsfwChannel, titleCase } from '@/lib/utils/functions.js';
import { Anilist, parseDescription } from '@rygent/anilist';
import { DurationFormatter } from '@sapphire/time-utilities';
import { cutText } from '@sapphire/utilities';
import moment from 'moment';
import { nanoid } from 'nanoid';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'anime',
			description: 'Search for an Anime on Anilist.',
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

		const anilist = new Anilist();
		const raw = await anilist.search({ type: 'anime', search }).then(
			({
				data: {
					Page: { media }
				}
			}) => media
		);
		if (!raw?.length) {
			return interaction.reply({ content: 'Nothing found for this search.', flags: MessageFlags.Ephemeral });
		}

		const response = isNsfwChannel(interaction.channel) ? raw : raw.filter((data) => !data?.isAdult);
		if (!response.length) {
			return interaction.reply({
				content: `This search contain explicit content, use ${bold('NSFW Channel')} instead.`,
				flags: MessageFlags.Ephemeral
			});
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
						.setPlaceholder('Select an anime')
						.setOptions(
							...response.map((data) => ({
								value: data!.id.toString(),
								label:
									cutText(
										Object.values(data!.title!).find((title) => title?.length),
										1e2
									) ?? 'Unknown Name',
								...(data!.description?.length && { description: cutText(parseDescription(data!.description), 1e2) })
							}))
						)
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('Anilist')}`)));

		const reply = await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });

		const filter = (i: StringSelectMenuInteraction) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({
			filter,
			componentType: ComponentType.StringSelect,
			time: 6e4,
			max: 1
		});

		collector.on('ignore', (i) => void i.deferUpdate());
		collector.on('collect', (i) => {
			const [selected] = i.values;
			const data = response.find((item) => item?.id.toString() === selected)!;

			const startDate = !Object.values(data.startDate!).some((value) => value === null)
				? Object.values(data.startDate!).join('/')
				: null;
			const endDate = !Object.values(data.endDate!).some((value) => value === null)
				? Object.values(data.endDate!).join('/')
				: null;

			const media = new MediaGalleryBuilder().addItems(
				new MediaGalleryItemBuilder().setURL(`https://img.anili.st/media/${data.id}`)
			);
			container.spliceComponents(0, 1, media);

			const section = new TextDisplayBuilder().setContent(
				[
					heading(
						hyperlink(
							Object.values(data.title!).find((item) => item?.length),
							data.siteUrl!
						),
						2
					),
					...(data.description?.length ? [parseDescription(data.description)] : [])
				].join('\n')
			);
			container.spliceComponents(1, 1, section);

			const detail = new TextDisplayBuilder().setContent(
				[
					...(data.title?.romaji ? [`${bold('Romaji:')} ${data.title.romaji}`] : []),
					...(data.title?.english ? [`${bold('English:')} ${data.title.english}`] : []),
					...(data.title?.native ? [`${bold('Native:')} ${data.title.native}`] : []),
					`${bold('Type:')} ${getType(data.format!)}`,
					`${bold('Status:')} ${titleCase(data.status!.replace(/_/g, ' '))}`,
					`${bold('Source:')} ${titleCase(data.source!.replace(/_/g, ' '))}`,
					...(startDate ? [`${bold('Aired:')} ${getDate(startDate, endDate)}`] : []),
					...(data.duration
						? [`${bold('Length:')} ${getDurationLength(data.duration, data.episodes!, data.format!)}`]
						: []),
					...(data.nextAiringEpisode
						? [
								`${bold('Next episodes:')} ${time(data.nextAiringEpisode.airingAt, 'R')} (episode ${
									data.nextAiringEpisode.episode
								})`
							]
						: []),
					...(data.isAdult ? [`${bold('Explicit content:')} ${data.isAdult ? 'Yes' : 'No'}`] : []),
					`${bold('Popularity:')} ${formatNumber(data.popularity!)}`,
					...(data.characters?.nodes?.length
						? [`${bold('Characters:')} ${formatArray(data.characters.nodes.map((item) => item!.name!.full!))}`]
						: []),
					...(data.externalLinks?.filter((item) => item?.type === 'STREAMING')?.length
						? [
								`${bold('Networks:')} ${data.externalLinks
									.filter((item) => item?.type === 'STREAMING')
									.map((item) => hyperlink(item?.site as string, item?.url as string))
									.join(', ')}`
							]
						: [])
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
	if (startDate === endDate) return moment(new Date(startDate)).format('MMM D, YYYY');
	else if (startDate && !endDate) return `${moment(new Date(startDate)).format('MMM D, YYYY')} to ?`;
	return `${moment(new Date(startDate)).format('MMM D, YYYY')} to ${moment(new Date(endDate as string)).format(
		'MMM D, YYYY'
	)}`;
}
