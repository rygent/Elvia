import Command from '../../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { parseEmoji } from 'discord.js';
import { Colors, Credentials, Emojis } from '../../../../Utils/Constants.js';
import { formatArray, truncate } from '../../../../Structures/Util.js';
import { nanoid } from 'nanoid';
import Spotify from 'node-spotify-api';
import moment from 'moment';
import 'moment-duration-format';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['search', 'spotify'],
			description: 'Search for a song on Spotify.'
		});
	}

	async run(interaction) {
		const search = interaction.options.getString('search', true);

		const spotify = new Spotify({ id: Credentials.SpotifyClientId, secret: Credentials.SpotifyClientSecret });

		const response = await spotify.search({ type: 'track', query: search, limit: 10 }).then(({ tracks }) => tracks.items);
		if (!response.length) return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });

		const selectId = `select-${nanoid()}`;
		const select = new ActionRowBuilder()
			.addComponents(new SelectMenuBuilder()
				.setCustomId(selectId)
				.setPlaceholder('Select a song!')
				.addOptions(...response.map(data => ({
					value: data.id,
					label: truncate(data.name, 95),
					description: truncate(formatArray(data.artists.map(({ name }) => name)), 95)
				}))));

		const reply = await interaction.reply({ content: `I found **${response.length}** possible matches, please select one of the following:`, components: [select] });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60_000 });

		collector.on('collect', async (i) => {
			const [selected] = i.values;
			const data = response.find(item => item.id === selected);

			const button = new ActionRowBuilder()
				.addComponents(new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setEmoji(parseEmoji(Emojis.Spotify))
					.setLabel('Play on Spotify')
					.setURL(data.external_urls.spotify));

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Spotify', iconURL: 'https://i.imgur.com/9xO7toS.png', url: 'https://www.spotify.com/' })
				.setTitle(data.name)
				.setDescription([
					`***Artists:*** ${formatArray(data.artists.map(({ name }) => name))}`,
					`***Album:*** ${data.album.name}`,
					`***Tracks:*** ${data.track_number.formatNumber()} of ${data.album.total_tracks.formatNumber()}`,
					`***Released:*** ${moment(data.album.release_date).format('MMMM D, YYYY')}`,
					`***Duration:*** ${moment.duration(data.duration_ms).format('HH:mm:ss')}`,
					`***Popularity:*** ${data.popularity.formatNumber()}`
				].join('\n'))
				.setImage(data.album.images[0].url)
				.setFooter({ text: `Powered by Spotify`, iconURL: interaction.user.avatarURL() });

			return i.update({ content: null, embeds: [embed], components: [button] });
		});

		collector.on('ignore', (i) => {
			if (i.user.id !== interaction.user.id) return i.deferUpdate();
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}

}
