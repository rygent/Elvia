const Command = require('../../Structures/Command.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Color, Emoji, Environment } = require('../../Utils/Configuration.js');
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
			id: Environment.SPOTIFY_ID,
			secret: Environment.SPOTIFY_SECRET
		});

		const query = args.join(' ').trim();
		if (!query) return message.reply({ content: 'Please enter the song title to search!' });

		const response = await spotify.search({ type: 'track', query: query });
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
			.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by Spotify`, message.author.avatarURL({ dynamic: true }));

		return message.reply({ embeds: [embed], components: [button] });
	}

};
