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
import { bold, heading, hyperlink, inlineCode, italic, subtext } from '@discordjs/formatters';
import { formatArray, titleCase } from '@/lib/utils/functions.js';
import { fetcher } from '@/lib/fetcher.js';
import { cutText } from '@sapphire/utilities';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'steam',
			description: 'Search for a Games on Steam.',
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
		params.append('appids', id);
		params.append('l', 'en');
		params.append('cc', 'us');

		const respond = await fetcher(`https://store.steampowered.com/api/appdetails?${params.toString()}`, {
			method: 'GET'
		}).then((res) => res[id].data);

		if (!respond) {
			return interaction.reply({ content: 'Nothing found for this query.', flags: MessageFlags.Ephemeral });
		}

		const container = new ContainerBuilder()
			.addMediaGalleryComponents(
				new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(respond.header_image))
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						heading(hyperlink(respond.name, `https://store.steampowered.com/app/${respond.steam_appid}/`), 2),
						respond.short_description,
						...(respond.content_descriptors?.notes
							? [`\n${italic(respond.content_descriptors.notes.replace(/\r|\n/g, ''))}`]
							: [])
					].join('\n')
				)
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						`${bold('Release Date:')} ${respond.release_date.coming_soon ? 'Coming soon' : respond.release_date.date}`,
						`${bold('Price:')} ${inlineCode(respond.price_overview ? respond.price_overview.final_formatted : 'Free')}`,
						`${bold('Genres:')} ${respond.genres.map(({ description }: any) => description).join(', ')}`,
						...(respond.platforms
							? [
									`${bold('Platform:')} ${titleCase(
										formatArray(Object.keys(respond.platforms).filter((item) => respond.platforms[item]))
									).replace(/And/g, 'and')}`
								]
							: []),
						...(respond.metacritic
							? [
									`${bold('Metascores:')} ${respond.metacritic.score} from ${hyperlink('metacritic', respond.metacritic.url)}`
								]
							: []),
						`${bold('Developers:')} ${respond.developers.join(', ')}`,
						`${bold('Publishers:')} ${respond.publishers.join(', ')}`
					].join('\n')
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('Steam')}`)));

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}

	public override async autocomplete(interaction: AutocompleteInteraction<'cached' | 'raw'>) {
		const focused = interaction.options.getFocused(true);

		const params = new URLSearchParams();
		params.append('term', focused.value);
		params.append('l', 'en');
		params.append('cc', 'us');

		const respond = await fetcher(`https://store.steampowered.com/api/storesearch?${params.toString()}`, {
			method: 'GET'
		}).then((data) => data.items.filter((item: any) => item.type === 'app'));

		if (!respond.length) return interaction.respond([]);

		const options = respond.map((data: any) => ({
			name: cutText(data.name, 1e2),
			value: data.id.toString()
		}));

		return interaction.respond(options.slice(0, 25));
	}
}
