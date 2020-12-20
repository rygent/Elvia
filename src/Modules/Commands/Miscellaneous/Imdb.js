const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Access, Colors } = require('../../../Structures/Configuration.js');
const IMDb = require('imdb-api');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['movie', 'series'],
			description: 'Searches IMDb for your query, getting movie/TV series results.',
			category: 'Miscellaneous',
			usage: '<querySearch>',
			cooldown: 5000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			return message.quote('Please give the name of movie or series.');
		}

		try {
			const data = await IMDb.get({ name: query }, { apiKey: Access.IMDB });

			const embed = new MessageEmbed()
				.setColor(Colors.IMDB)
				.setAuthor('IMDb Search Engine', 'https://i.imgur.com/0BTAjjv.png', 'https://www.imdb.com/')
				.setTitle(data.title)
				.setURL(data.imdburl)
				.setThumbnail(data.poster)
				.setDescription(data.plot)
				.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by IMDb`, message.author.avatarURL({ dynamic: true }));

			if (data.series !== true) {
				embed.addField('__Details__', [
					`***Released:*** ${moment(data.released).format('MMMM DD, YYYY')}`,
					`***Ratings:*** ${data.rating} ⭐ (by ${data.votes} users)`,
					`***Metascores:*** ${data.metascore} from [metacritic](https://metacritic.com)`,
					`***Genres:*** ${data.genres}`,
					`***Rated:*** ${data.rated}`,
					`***Type:*** ${data.type.toProperCase()}`,
					`***Runtime:*** ${data.runtime}`,
					`***Directors:*** ${data.director}`,
					`***Cast:*** ${data.actors}`,
					`***Production:*** ${data.production || 'Unknown'}`,
					`***Country:*** ${data.country}`,
					`***Language:*** ${data.languages}`
				].join('\n'));
			} else {
				embed.addField('__Details__', [
					`***Released:*** ${moment(data.released).format('MMMM DD, YYYY')}`,
					`***Released Year:*** ${data._year_data}`,
					`***Ratings:*** ${data.rating} ⭐ (by ${data.votes} users)`,
					`***Genres:*** ${data.genres}`,
					`***Rated:*** ${data.rated}`,
					`***Type:*** ${data.type.toProperCase()}`,
					`***Runtime:*** ${data.runtime}`,
					`***Total Seasons:*** ${data.totalseasons}`,
					`***Directors:*** ${data.director}`,
					`***Cast:*** ${data.actors}`,
					`***Production:*** ${data.production || 'Unknown'}`,
					`***Country:*** ${data.country}`,
					`***Language:*** ${data.languages}`
				].join('\n'));
			}

			if (data.awards !== 'N/A') {
				embed.addField('__Awards__', data.awards, false);
			}

			return message.channel.send(embed);
		} catch (err) {
			if (err.message.startsWith('Movie not found!:')) {
				return message.quote('Request not found, make sure you have written the title correctly');
			}
		}
	}

};
