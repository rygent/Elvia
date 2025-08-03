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
import { bold, heading, hyperlink, subtext } from '@discordjs/formatters';
import { formatArray, formatNumber, isNsfwChannel, titleCase } from '@/lib/utils/functions.js';
import { Anilist } from '@rygent/anilist';
import { cutText } from '@sapphire/utilities';
import { nanoid } from 'nanoid';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'manga',
			description: 'Search for a Manga on Anilist.',
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

		const anilist = new Anilist();
		const respond = await anilist.media.search({ type: 'Manga', search });
		if (!respond?.length) {
			return interaction.reply({ content: 'Nothing found for this search.', flags: MessageFlags.Ephemeral });
		}

		const result = respond.filter((data) => {
			if (data.isAdult && !isNsfwChannel(interaction.channel)) return false;
			return true;
		});

		if (!result.length) {
			return interaction.reply({
				content: `This search contain explicit content, use ${bold('NSFW Channel')} instead.`,
				flags: MessageFlags.Ephemeral
			});
		}

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`I found ${bold(result.length.toString())} possible matches, please select one of the following:`
				)
			)
			.addActionRowComponents(
				new ActionRowBuilder().addStringSelectMenuComponent(
					new StringSelectMenuBuilder()
						.setCustomId(nanoid())
						.setPlaceholder('Select a manga')
						.setOptions(
							...result.map((data) => ({
								value: data.id.toString(),
								label: cutText(data.title!.english! || data.title!.userPreferred!, 1e2),
								...(data.description?.length && { description: cutText(data.description, 1e2) })
							}))
						)
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('Anilist')}`)));

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
		collector.on('collect', (i) => {
			const [selected] = i.values;
			const data = result.find((item) => item?.id.toString() === selected)!;

			const media = new MediaGalleryBuilder().addItems(
				new MediaGalleryItemBuilder().setURL(`https://img.anili.st/media/${data.id}`)
			);
			container.spliceComponents(0, 1, media);

			const section = new TextDisplayBuilder().setContent(
				[
					heading(hyperlink(data.title!.english! || data.title!.userPreferred!, data.siteUrl!), 2),
					...(data.description?.length ? [data.description] : [])
				].join('\n')
			);
			container.spliceComponents(1, 1, section);

			const detail = new TextDisplayBuilder().setContent(
				[
					...(data.title?.romaji ? [`${bold('Romaji:')} ${data.title.romaji}`] : []),
					...(data.title?.english ? [`${bold('English:')} ${data.title.english}`] : []),
					...(data.title?.native ? [`${bold('Native:')} ${data.title.native}`] : []),
					...(data.format ? [`${bold('Type:')} ${getType(data.format, data.countryOfOrigin!)}`] : []),
					...(data.status ? [`${bold('Status:')} ${titleCase(data.status.replace(/_/g, ' '))}`] : []),
					...(data.source ? [`${bold('Source:')} ${titleCase(data.source.replace(/_/g, ' '))}`] : []),
					...(data.startDate ? [`${bold('Published:')} ${getDate(data.startDate, data.endDate!)}`] : []),
					...(data.volumes ? [`${bold('Volumes:')} ${data.volumes}`] : []),
					...(data.chapters ? [`${bold('Chapters:')} ${data.chapters}`] : []),
					...(data.isAdult ? [`${bold('Explicit content:')} ${data.isAdult ? 'Yes' : 'No'}`] : []),
					...(data.popularity ? [`${bold('Popularity:')} ${formatNumber(data.popularity)}`] : []),
					...(data.characters?.length
						? [`${bold('Characters:')} ${formatArray(data.characters.map((item) => item.name!.userPreferred!))}`]
						: []),
					...(data.externalLinks?.filter((item) => item.type === 'STREAMING')?.length
						? [
								`${bold('Networks:')} ${data.externalLinks
									.filter((item) => item.type === 'STREAMING')
									.map((item) => hyperlink(item.site, item.url!))
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

function getType(format: string, countryOfOrigin: string): string {
	if (format === 'MANGA' && countryOfOrigin === 'KR') return 'Manhwa';
	else if (format === 'MANGA' && countryOfOrigin === 'CN') return 'Manhua';
	else if (format === 'NOVEL') return 'Light Novel';
	return titleCase(format.replace(/_/g, ' '));
}

function getDate(startDate: string, endDate: string | null): string {
	if (startDate === endDate) return startDate;
	else if (startDate && !endDate) return `${startDate} to ?`;
	return `${startDate} to ${endDate}`;
}
