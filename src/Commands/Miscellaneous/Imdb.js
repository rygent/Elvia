const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Api, Color } = require('../../Utils/Setting.js');
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
			const result = await IMDb.get({ name: query }, { apiKey: Api.Imdb });

			const embed = new MessageEmbed()
				.setColor(Color.IMDB)
				.setAuthor('IMDb', 'https://i.imgur.com/0BTAjjv.png', 'https://www.imdb.com/')
				.setTitle(result.title)
				.setURL(result.imdburl)
				.setThumbnail(result.poster)
				.setDescription(result.plot)
				.setFooter(`${message.author.username}  •  Powered by IMDb`, message.author.avatarURL({ dynamic: true }));

			if (result.series !== true) {
				embed.addField('__Details__', [
					`***Released:*** ${moment(result.released).format('MMMM DD, YYYY')}`,
					`***Ratings:*** ${result.rating} ⭐ (by ${result.votes} users)`,
					`***Metascores:*** ${result.metascore} from [metacritic](https://metacritic.com)`,
					`***Genres:*** ${result.genres}`,
					`***Rated:*** ${result.rated}`,
					`***Type:*** ${result.type.toProperCase()}`,
					`***Runtime:*** ${result.runtime}`,
					`***Directors:*** ${result.director}`,
					`***Cast:*** ${result.actors}`,
					`***Production:*** ${result.production || 'Unknown'}`,
					`***Country:*** ${result.country}`,
					`***Language:*** ${result.languages}`
				].join('\n'));
			} else {
				embed.addField('__Details__', [
					`***Released:*** ${moment(result.released).format('MMMM DD, YYYY')}`,
					`***Released Year:*** ${result._year_result}`,
					`***Ratings:*** ${result.rating} ⭐ (by ${result.votes} users)`,
					`***Genres:*** ${result.genres}`,
					`***Rated:*** ${result.rated}`,
					`***Type:*** ${result.type.toProperCase()}`,
					`***Runtime:*** ${result.runtime}`,
					`***Total Seasons:*** ${result.totalseasons}`,
					`***Directors:*** ${result.director}`,
					`***Cast:*** ${result.actors}`,
					`***Production:*** ${result.production || 'Unknown'}`,
					`***Country:*** ${result.country}`,
					`***Language:*** ${result.languages}`
				].join('\n'));
			}

			if (result.awards !== 'N/A') {
				embed.addField('__Awards__', result.awards, false);
			}

			return message.reply({ embeds: [embed] });
		} catch (err) {
			if (err.message.startsWith('Movie not found!:')) {
				return message.reply({ content: 'Search not found, please make sure you have entered the title correctly!' });
			}
		}
	}

};
