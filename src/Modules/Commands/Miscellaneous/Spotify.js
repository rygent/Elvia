const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Access, Colors } = require('../../../Structures/Configuration.js');
const Spotify = require('node-spotify-api');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Shows song information on spotify.',
			category: 'Miscellaneous',
			usage: '[searchQuery]',
			cooldown: 3000
		});
	}

	async run(message, args) {
		const spotify = new Spotify({
			id: Access.Spotify.CLIENT_ID,
			secret: Access.Spotify.CLIENT_SECRET
		});

		const query = args.join(' ').trim();
		if (!query) return message.quote('Please enter the song title to search!');

		const response = await spotify.search({ type: 'track', query: query });
		const track = response.tracks.items[0];
		const artists = track.artists.map(artist => artist.name);

		const embed = new MessageEmbed()
			.setColor(Colors.SPOTIFY)
			.setAuthor('Spotify Search Engine', 'https://i.imgur.com/9xO7toS.png', 'https://www.spotify.com/')
			.setTitle(track.name)
			.setURL(track.external_urls.spotify)
			.setImage(track.album.images[0].url)
			.setDescription([
				`***Artists:*** ${artists.join(', ')}`,
				`***Album:*** ${track.album.name}`,
				`***Tracks:*** ${track.album.total_tracks.formatNumber()}`,
				`***Release Date:*** ${moment(track.album.release_date).format('MMMM D, YYYY')}`,
				`***Duration:*** ${moment.duration(track.duration_ms).format('d [Days] h [Hours] m [Minutes] s [Seconds]')}`,
				`***Popularity:*** ${track.popularity.formatNumber()}`
			].join('\n'))
			.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by Spotify`, message.author.avatarURL({ dynamic: true }));

		return message.channel.send({ embeds: [embed] });
	}

};
