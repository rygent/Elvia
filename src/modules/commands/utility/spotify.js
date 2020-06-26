const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Access, Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const Spotify = require('node-spotify-api');
const moment = require('moment');
const ms = require('pretty-ms');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Searches for spotify tracks and artists.',
			category: 'utility',
			usage: '[artist] <query>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	async run(message, [type, ...query]) {
		const spotify = new Spotify({
			id: Access.Spotify.CLIENT_ID,
			secret: Access.Spotify.CLIENT_SECRET
		});

		const embed = new MessageEmbed()
			.setColor(Colors.SPOTIFY)
			.setAuthor('Spotify Search Engine', 'https://i.imgur.com/9xO7toS.png', 'https://www.spotify.com/')
			.setFooter(`Responded in ${this.client.functions.responseTime(message)} | Powered by Spotify`, message.author.avatarURL({ dynamic: true }));

		if (type === 'artist') {
			if (!query) {
				message.channel.send('You must provide a search query!');
				return;
			}

			const response = await spotify.search({ type: 'artist', query: query.join(' ').trim() });
			const artists = response.artists.items;

			embed.setTitle(artists[0].name);
			embed.setURL(artists[0].external_urls.spotify);
			embed.setImage(artists[0].images[0].url);
			embed.setDescription(stripIndents`
                ***Genres:*** ${artists[0].genres.join(', ')}
                ***Followers:*** ${artists[0].followers.total.formatNumber()}
                ***Popularity:*** ${artists[0].popularity.formatNumber()}`
			);

			message.channel.send(embed);
			return;
		}

		if (!query) {
			message.channel.send('You must provide a search query!');
			return;
		}

		const response = await spotify.search({ type: 'track', query: query.join(' ').trim() });
		const track = response.tracks.items[0];
		const artists = track.artists.map(artist => artist.name);
		const artistResponse = await spotify.search({ type: 'artist', query: artists[0] });

		embed.setTitle(track.name);
		embed.setURL(track.external_urls.spotify);
		embed.setThumbnail(artistResponse.artists.items[0].images[0].url);
		embed.setImage(track.album.images[0].url);
		embed.setDescription(stripIndents`
            ***Artists:*** ${artists.join(', ')}
            ***Album:*** ${track.album.name}
            ***Tracks:*** ${track.album.total_tracks.formatNumber()}
            ***Release Date:*** ${moment(track.album.release_date).format('MMMM D, YYYY')}
            ***Duration:*** ${ms(track.duration_ms, { secondsDecimalDigits: 0 })}
            ***Popularity:*** ${track.popularity.formatNumber()}`
		);

		message.channel.send(embed);
	}

};
