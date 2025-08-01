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
import { formatArray, formatNumber } from '@/lib/utils/functions.js';
import { env } from '@/env.js';
import { Spotify } from '@rygent/spotify';
import { cutText } from '@sapphire/utilities';
import { nanoid } from 'nanoid';
import moment from 'moment';
import 'moment-duration-format';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'spotify',
			description: 'Search for a song on Spotify.',
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

		const spotify = new Spotify({ id: env.SPOTIFY_CLIENT_ID, secret: env.SPOTIFY_CLIENT_SECRET });
		const result = await spotify
			.search({ type: 'track', query: search, limit: 10 })
			.then(({ tracks }) => tracks!.items);
		if (!result.length) {
			return interaction.reply({ content: 'Nothing found for this search.', flags: MessageFlags.Ephemeral });
		}

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`I found ${bold(result.length.toString())} possible matches, please select one of the following:`
				)
			)
			.addActionRowComponents(
				new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
					new StringSelectMenuBuilder()
						.setCustomId(nanoid())
						.setPlaceholder('Select a song')
						.setOptions(
							...result.map((data) => ({
								value: data.id,
								label: cutText(data.name, 1e2),
								description: cutText(formatArray(data.artists.map(({ name }) => name)), 1e2)
							}))
						)
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('Spotify')}`)));

		const response = await interaction.reply({
			components: [container],
			flags: MessageFlags.IsComponentsV2,
			withResponse: true
		});

		const reply = response.resource?.message;
		if (!reply) return;

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
			const data = result.find((item) => item.id === selected)!;

			const media = new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(data.album.images[0]!.url));
			container.spliceComponents(0, 1, media);

			const section = new TextDisplayBuilder().setContent(
				[
					heading(hyperlink(data.name, data.external_urls.spotify), 2),
					`${bold('Artists:')} ${formatArray(data.artists.map(({ name }) => name))}`,
					`${bold('Album:')} ${data.album.name}`,
					`${bold('Tracks:')} ${formatNumber(data.track_number)} of ${formatNumber(data.album.total_tracks)}`,
					`${bold('Released:')} ${moment(data.album.release_date).format('MMMM D, YYYY')}`,
					// eslint-disable-next-line import-x/no-named-as-default-member
					`${bold('Duration:')} ${moment.duration(data.duration_ms).format('HH:mm:ss')}`,
					`${bold('Popularity:')} ${formatNumber(data.popularity)}`
				].join('\n')
			);
			container.spliceComponents(1, 1, section);

			return i.update({ components: [container], flags: MessageFlags.IsComponentsV2 });
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}
}
