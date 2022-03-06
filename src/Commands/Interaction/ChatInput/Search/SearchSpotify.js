const Interaction = require('../../../../Structures/Interaction');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { ButtonStyle } = require('discord-api-types/v9');
const { Colors, Emojis, Secrets } = require('../../../../Utils/Constants');
const Spotify = require('node-spotify-api');
const moment = require('moment');
require('moment-duration-format');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'search',
			subCommand: 'spotify',
			description: 'Search for a song on Spotify.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);

		const spotify = new Spotify({
			id: Secrets.SpotifyId,
			secret: Secrets.SpotifySecret
		});

		const result = await spotify.search({ type: 'track', query: search });
		const track = result.tracks.items[0];
		const artists = track.artists.map(artist => artist.name);

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle(ButtonStyle.Link)
				.setLabel('Play on Spotify')
				.setEmoji(Emojis.Spotify)
				.setURL(track.external_urls.spotify));


		const embed = new MessageEmbed()
			.setColor(Colors.Default)
			.setAuthor({ name: 'Spotify', iconURL: 'https://i.imgur.com/9xO7toS.png', url: 'https://www.spotify.com/' })
			.setTitle(track.name)
			.setImage(track.album.images[0].url)
			.setDescription([
				`***Artists:*** ${artists.join(', ')}`,
				`***Album:*** ${track.album.name}`,
				`***Tracks:*** ${track.track_number.toLocaleString()} of ${track.album.total_tracks.toLocaleString()}`,
				`***Released:*** ${moment(track.album.release_date).format('MMMM D, YYYY')}`,
				`***Duration:*** ${moment.duration(track.duration_ms).format('HH:mm:ss')}`,
				`***Popularity:*** ${track.popularity.toLocaleString()}`
			].join('\n'))
			.setFooter({ text: `Powered by Spotify`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
