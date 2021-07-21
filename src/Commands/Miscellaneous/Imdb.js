const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color, Environment } = require('../../Utils/Configuration.js');
const IMDb = require('imdb-api');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['movie', 'series'],
			description: 'Shows Movie / TV Series information from IMDb.',
			category: 'Miscellaneous',
			usage: '[searchQuery]',
			cooldown: 3000
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			return message.reply({ content: 'Please enter a movie / tv series title to start searching!' });
		}

		try {
			const data = await IMDb.get({ name: query }, { apiKey: Environment.IMDB });

			const embed = new MessageEmbed()
				.setColor(Color.IMDB)
				.setAuthor('IMDb', 'https://i.imgur.com/0BTAjjv.png', 'https://www.imdb.com/')
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

			return message.reply({ embeds: [embed] });
		} catch (err) {
			if (err.message.startsWith('Movie not found!:')) {
				return message.reply({ content: 'Search not found, please make sure you have entered the title correctly!' });
			}
		}
	}

};
