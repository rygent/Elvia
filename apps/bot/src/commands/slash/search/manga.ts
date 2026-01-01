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
import { bold, heading, hyperlink, subtext } from '@discordjs/formatters';
import { formatArray, formatNumber, isNsfwChannel, titleCase } from '@/lib/utils/functions.js';
import { Anilist } from '@rygent/anilist';
import { cutText } from '@sapphire/utilities';

export default class extends CoreCommand<ApplicationCommandType.ChatInput> {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'manga',
			description: 'Search for a Manga on Anilist.',
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
		const respond = await anilist.media.manga(id);
		if (respond.isAdult && !isNsfwChannel(interaction.channel)) {
			return interaction.reply({ content: `This manga contain adult content.`, flags: MessageFlags.Ephemeral });
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
						...(respond.format ? [`${bold('Type:')} ${getType(respond.format, respond.countryOfOrigin!)}`] : []),
						...(respond.status ? [`${bold('Status:')} ${titleCase(respond.status.replace(/_/g, ' '))}`] : []),
						...(respond.source ? [`${bold('Source:')} ${titleCase(respond.source.replace(/_/g, ' '))}`] : []),
						...(respond.startDate ? [`${bold('Published:')} ${getDate(respond.startDate, respond.endDate!)}`] : []),
						...(respond.volumes ? [`${bold('Volumes:')} ${respond.volumes}`] : []),
						...(respond.chapters ? [`${bold('Chapters:')} ${respond.chapters}`] : []),
						...(respond.isAdult ? [`${bold('Explicit content:')} ${respond.isAdult ? 'Yes' : 'No'}`] : []),
						...(respond.popularity ? [`${bold('Popularity:')} ${formatNumber(respond.popularity)}`] : []),
						...(respond.characters?.length
							? [`${bold('Characters:')} ${formatArray(respond.characters.map((item) => item.name!.userPreferred!))}`]
							: []),
						...(respond.externalLinks?.filter((item) => item.type === 'STREAMING')?.length
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
		const focused = interaction.options.getFocused(true);

		const anilist = new Anilist();
		const respond = await anilist.media.search({ type: 'Manga', search: focused.value });

		if (!respond.length) return interaction.respond([]);

		const options = respond
			.filter((data) => !(data.isAdult && !isNsfwChannel(interaction.channel)))
			.map((data) => ({
				name: cutText(data.title!.userPreferred!, 1e2),
				value: data.id
			}));

		return interaction.respond(options.slice(0, 25));
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
