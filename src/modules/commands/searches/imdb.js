const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Access, Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const IMDb = require('imdb-api');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['movie', 'series'],
			description: 'Searches IMDd for your query, getting movie/TV series results.',
			category: 'searches',
			usage: '<query>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	async run(message, args) {
		const query = args.join(' ');
		if (!query) {
			message.channel.send('Please give the name of movie or series');
			return;
		}

		IMDb.get({ name: query }, { apiKey: Access.IMDB }).then(res => {
			const embed = new MessageEmbed()
				.setColor(Colors.IMDB)
				.setAuthor('IMDb Search Engine', 'https://i.imgur.com/0BTAjjv.png', 'https://www.imdb.com/')
				.setTitle(res.title)
				.setURL(res.imdburl)
				.setThumbnail(res.poster)
				.setDescription(res.plot)
				.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by IMDb`, message.author.avatarURL({ dynamic: true }));

			if (res.series !== true) {
				embed.addField('__Details__', stripIndents`
                    ***Released:*** ${moment(res.released).format('MMMM DD, YYYY')}
                    ***Ratings:*** ${res.rating} ⭐ (by ${res.votes} users)
                    ***Metascores:*** ${res.metascore} from [metacritic](https://metacritic.com)
                    ***Genres:*** ${res.genres}
                    ***Rated:*** ${res.rated}
                    ***Type:*** ${res.type.toProperCase()}
                    ***Runtime:*** ${res.runtime}
                    ***Directors:*** ${res.director}
                    ***Cast:*** ${res.actors}
                    ***Production:*** ${res.production || 'Unknown'}
                    ***Country:*** ${res.country}
                    ***Language:*** ${res.languages}`);
			} else {
				embed.addField('__Details__', stripIndents`
                    ***Released:*** ${moment(res.released).format('MMMM DD, YYYY')}
                    ***Released Year:*** ${res._year_data}
                    ***Ratings:*** ${res.rating} ⭐ (by ${res.votes} users)
                    ***Genres:*** ${res.genres}
                    ***Rated:*** ${res.rated}
                    ***Type:*** ${res.type.toProperCase()}
                    ***Runtime:*** ${res.runtime}
                    ***Total Seasons:*** ${res.totalseasons}
                    ***Directors:*** ${res.director}
                    ***Cast:*** ${res.actors}
                    ***Production:*** ${res.production || 'Unknown'}
                    ***Country:*** ${res.country}
                    ***Language:*** ${res.languages}`);
			}

			if (res.awards !== 'N/A') {
				embed.addField('__Awards__', res.awards, false);
			}

			message.channel.send(embed);
		}).catch(err => {
			if (err.message.startsWith('Movie not found!:')) {
				message.channel.send('Request not found, make sure you have written the title correctly');
			}
		});
	}

};
