const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
const Jikan = require('jikan-node');
const mal = new Jikan();

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['mal', 'myanimelist'],
			description: 'Searches information from my anime list.',
			category: 'Miscellaneous',
			usage: '<querySearch>',
			cooldown: 5000
		});
	}

	/* eslint-disable consistent-return *//* eslint-disable id-length */
	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			return message.quote('Please specify an anime to search!');
		}

		function output(a) {
			var s = a[0].name;
			for (var i = 1; i < a.length; i++) {
				s += `, ${a[i].name}`;
			}
			return s;
		}
		function andanotheroutput(s) {
			let i = s.lastIndexOf(' ', 2047);
			if (i > 2044) {
				i = s.lastIndexOf(' ', i - 1);
			}
			console.log(i);
			return `${s.substring(0, i + 1)}...`;
		}

		try {
			mal.search('anime', query).then(data => {
				const id = data.results[0].mal_id;
				// eslint-disable-next-line complexity
				mal.findAnime(id).then(result => {
					if (result.length === 0) return message.quote('Can\'t search, make sure the anime title is correct');

					const embed = new MessageEmbed()
						.setColor(Colors.MAL)
						.setAuthor('MyAnimeList', 'https://i.imgur.com/QABhOrL.png', 'https://myanimelist.net/')
						.setTitle(result.title)
						.setURL(result.url)
						.setThumbnail(result.image_url)
						.setDescription(result.synopsis ? result.synopsis.length <= 2048 ? result.synopsis.replace(/<[^>]*>/g, '') : andanotheroutput(result.synopsis.replace(/<[^>]*>/g, '')) : '`N/A`')
						.addField('__Details__', [
							`***English:*** ${result.title_english ? result.title_english : result.title}`,
							`***Synonyms:*** ${result.title_synonyms[0] ? result.title_synonyms.join(', ').toString() : '`N/A`'}`,
							`***Japanese:*** ${result.title_japanese}`,
							`***Score:*** ${result.score ? result.score : '`N/A`'} (${result.scored_by ? `${result.scored_by.formatNumber()} users` : '`N/A`'})`,
							`***Genres:*** ${result.genres[0] ? output(result.genres) : '`N/A`'}`,
							`***Rating:*** ${result.rating ? result.rating : '`N/A`'}`,
							`***Source:*** ${result.source}`,
							`***Type:*** ${result.type ? result.type : '`N/A`'}`,
							`***Premiered:*** ${result.premiered ? result.premiered : '`N/A`'}`,
							`***Broadcast:*** ${result.broadcast}`,
							`***Episodes:*** ${result.episodes ? result.episodes : '`N/A`'}`,
							`***Duration:*** ${result.duration ? result.duration : '`N/A`'}`,
							`***Status:*** ${result.status}`,
							`***Aired:*** ${result.aired.string}`
						].join('\n'))
						.addField('\u200B', [
							`***Producers:*** ${result.producers[0] ? output(result.producers) : '`N/A`'}`,
							`***Licensors:*** ${result.licensors[0] ? output(result.licensors) : '`N/A`'}`,
							`***Studios:*** ${result.studios[0] ? output(result.studios) : '`N/A`'}`,
							`***Opening:*** ${result.opening_themes[0] ? result.opening_themes.join(', ').toString() : '`N/A`'}`,
							`***Ending:*** ${result.ending_themes[0] ? result.ending_themes.join(', ').toString() : '`N/A`'}`,
							`***Ranked:*** #${result.rank ? result.rank.formatNumber() : '`N/A`'}`,
							`***Popularity:*** #${result.popularity ? result.popularity.formatNumber() : '`N/A`'}`,
							`***Members:*** ${result.members ? result.members.formatNumber() : '`N/A`'}`,
							`***Favorites:*** ${result.favorites ? result.favorites.formatNumber() : '`N/A`'}`
						].join('\n'))
						.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by MyAnimeList`, message.author.avatarURL({ dynamic: true }));

					return message.channel.send(embed);
				});
			});
		} catch {
			return message.quote('Sorry, an API error has occured. Please try again later.');
		}
	}

};
