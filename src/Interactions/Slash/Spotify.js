const Interaction = require('../../Structures/Interaction.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Api, Color, Emoji } = require('../../Utils/Setting.js');
const Spotify = require('node-spotify-api');
const moment = require('moment');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'spotify',
			description: 'Gets song information from Spotify',
			options: [
				{ type: 'STRING', name: 'query', description: 'Search for a Song', required: true }
			]
		});
	}

	async run(interaction) {
		const title = interaction.options.getString('query', true);

		const spotify = new Spotify({
			id: Api.Spotify.ClientId,
			secret: Api.Spotify.ClientSecret
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
			.setFooter(`${interaction.user.username}  •  Powered by Spotify`, interaction.user.avatarURL({ dynamic: true }));

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
