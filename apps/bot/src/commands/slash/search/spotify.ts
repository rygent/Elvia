import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	type APIMessageComponentEmoji,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	ComponentType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, parseEmoji, StringSelectMenuInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';
import { Colors, Emojis } from '@/lib/utils/constants.js';
import { formatArray, formatNumber } from '@/lib/utils/functions.js';
import { env } from '@/env.js';
import { Spotify } from '@rygent/spotify';
import { cutText } from '@sapphire/utilities';
import { nanoid } from 'nanoid';
import moment from 'moment';
import 'moment-duration-format';

export default class extends Command {
	public constructor(client: Client<true>) {
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
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		const spotify = new Spotify({ id: env.SPOTIFY_CLIENT_ID, secret: env.SPOTIFY_CLIENT_SECRET });
		const response = await spotify
			.search({ type: 'track', query: search, limit: 10 })
			.then(({ tracks }) => tracks!.items);
		if (!response.length) {
			return interaction.reply({ content: 'Nothing found for this search.', flags: MessageFlags.Ephemeral });
		}

		const selectId = nanoid();
		const select = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setCustomId(selectId)
				.setPlaceholder('Select a song')
				.setOptions(
					...response.map((data) => ({
						value: data.id,
						label: cutText(data.name, 1e2),
						description: cutText(formatArray(data.artists.map(({ name }) => name)), 1e2)
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
			const data = response.find((item) => item.id === selected)!;

			const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setEmoji(parseEmoji(Emojis.Spotify) as APIMessageComponentEmoji)
					.setLabel('Play on Spotify')
					.setURL(data.external_urls.spotify)
			);

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Spotify', iconURL: 'https://i.imgur.com/9xO7toS.png', url: 'https://www.spotify.com/' })
				.setTitle(data.name)
				.setDescription(
					[
						`${bold(italic('Artists:'))} ${formatArray(data.artists.map(({ name }) => name))}`,
						`${bold(italic('Album:'))} ${data.album.name}`,
						`${bold(italic('Tracks:'))} ${formatNumber(data.track_number)} of ${formatNumber(data.album.total_tracks)}`,
						`${bold(italic('Released:'))} ${moment(data.album.release_date).format('MMMM D, YYYY')}`,
						`${bold(italic('Duration:'))} ${moment.duration(data.duration_ms).format('HH:mm:ss')}`,
						`${bold(italic('Popularity:'))} ${formatNumber(data.popularity)}`
					].join('\n')
				)
				.setImage(data.album.images[0]!.url)
				.setFooter({ text: `Powered by Spotify`, iconURL: interaction.user.avatarURL() as string });

			return void i.update({ content: null, embeds: [embed], components: [button] });
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}
}
