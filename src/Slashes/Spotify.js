const Slash = require('../Structures/Slash.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Color, Emoji, Environment } = require('../Utils/Configuration.js');
const Spotify = require('node-spotify-api');
const moment = require('moment');

module.exports = class extends Slash {

	constructor(...args) {
		super(...args, {
			description: 'Gets song information from Spotify',
			options: [{
				type: 'STRING',
				name: 'query',
				description: 'Search for a Song',
				required: true
			}]
		});
	}

	async run(interaction) {
		const title = interaction.options.getString('query', true);

		const spotify = new Spotify({
			id: Environment.SPOTIFY_ID,
			secret: Environment.SPOTIFY_SECRET
		});

		const response = await spotify.search({ type: 'track', query: title });
		const track = response.tracks.items[0];
		const artists = track.artists.map(artist => artist.name);

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('LINK')
				.setLabel('Play on Spotify')
				.setEmoji(Emoji.SPOTIFY)
				.setURL(track.external_urls.spotify));

		const embed = new MessageEmbed()
			.setColor(Color.SPOTIFY)
			.setAuthor('Spotify', 'https://i.imgur.com/9xO7toS.png', 'https://www.spotify.com/')
			.setTitle(track.name)
			.setURL(track.album.external_urls.spotify)
			.setImage(track.album.images[0].url)
			.setDescription([
				`***Artists:*** ${artists.join(', ')}`,
				`***Album:*** ${track.album.name}`,
				`***Tracks:*** ${track.track_number.formatNumber()} of ${track.album.total_tracks.formatNumber()}`,
				`***Released:*** ${moment(track.album.release_date).format('MMMM D, YYYY')}`,
				`***Duration:*** ${moment.duration(track.duration_ms).format('HH:mm:ss')}`,
				`***Popularity:*** ${track.popularity.formatNumber()}`
			].join('\n'))
			.setFooter(`Responded in ${this.client.utils.responseTime(interaction)} | Powered by Spotify`, interaction.user.avatarURL({ dynamic: true }));

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
