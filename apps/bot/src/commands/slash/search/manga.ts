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
import { bold, italic, underline } from '@discordjs/formatters';
import { Colors } from '@/lib/utils/constants.js';
import { formatArray, formatNumber, isNsfwChannel, titleCase } from '@/lib/utils/functions.js';
import { Anilist, parseDescription } from '@rygent/anilist';
import { cutText } from '@sapphire/utilities';
import { nanoid } from 'nanoid';
import moment from 'moment';

export default class extends Command {
	public constructor(client: Client<true>) {
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
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		const anilist = new Anilist();
		const raw = await anilist.search({ type: 'manga', search }).then(
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

		const selectId = nanoid();
		const select = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setCustomId(selectId)
				.setPlaceholder('Select a manga')
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
		);

		const reply = await interaction.reply({
			content: `I found ${bold(response.length.toString())} possible matches, please select one of the following:`,
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
		collector.on('collect', (i) => {
			const [selected] = i.values;
			const data = response.find((item) => item?.id.toString() === selected)!;

			const startDate = !Object.values(data.startDate!).some((value) => value === null)
				? Object.values(data.startDate!).join('/')
				: null;
			const endDate = !Object.values(data.endDate!).some((value) => value === null)
				? Object.values(data.endDate!).join('/')
				: null;

			const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Open in Browser').setURL(data.siteUrl!)
			);

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Anilist', iconURL: 'https://i.imgur.com/B48olfM.png', url: 'https://anilist.co/' })
				.setTitle(Object.values(data.title!).find((title) => title?.length))
				.addFields({
					name: underline(italic('Detail')),
					value: [
						...(data.title?.romaji ? [`${bold(italic('Romaji:'))} ${data.title.romaji}`] : []),
						...(data.title?.english ? [`${bold(italic('English:'))} ${data.title.english}`] : []),
						...(data.title?.native ? [`${bold(italic('Native:'))} ${data.title.native}`] : []),
						`${bold(italic('Type:'))} ${getType(data.format!, data.countryOfOrigin!)}`,
						`${bold(italic('Status:'))} ${titleCase(data.status!.replace(/_/g, ' '))}`,
						`${bold(italic('Source:'))} ${titleCase(data.source!.replace(/_/g, ' '))}`,
						...(startDate ? [`${bold(italic('Published:'))} ${getDate(startDate, endDate)}`] : []),
						...(data.volumes ? [`${bold(italic('Volumes:'))} ${data.volumes}`] : []),
						...(data.chapters ? [`${bold(italic('Chapters:'))} ${data.chapters}`] : []),
						...(data.isAdult ? [`${bold(italic('Explicit content:'))} ${data.isAdult ? 'Yes' : 'No'}`] : []),
						`${bold(italic('Popularity:'))} ${formatNumber(data.popularity!)}`
					].join('\n'),
					inline: false
				})
				.setImage(`https://img.anili.st/media/${data.id}`)
				.setFooter({ text: 'Powered by Anilist', iconURL: interaction.user.avatarURL() as string });

			if (data.description?.length) {
				embed.setDescription(cutText(parseDescription(data.description), 512));
			}

			if (data.characters?.nodes?.length) {
				embed.addFields({
					name: underline(italic('Characters')),
					value: formatArray(data.characters.nodes.map((item) => item!.name!.full!)),
					inline: false
				});
			}

			if (data.externalLinks?.filter((item) => item?.type === 'STREAMING')?.length) {
				embed.addFields({
					name: underline(italic('Networks')),
					value: data.externalLinks
						.filter((item) => item?.type === 'STREAMING')
						.map((item) => `[${item?.site}](${item?.url})`)
						.join(', '),
					inline: false
				});
			}

			return void i.update({ content: null, embeds: [embed], components: [button] });
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
	if (startDate === endDate) return moment(new Date(startDate)).format('MMM D, YYYY');
	else if (startDate && !endDate) return `${moment(new Date(startDate)).format('MMM D, YYYY')} to ?`;
	return `${moment(new Date(startDate)).format('MMM D, YYYY')} to ${moment(new Date(endDate!)).format('MMM D, YYYY')}`;
}
