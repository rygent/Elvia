const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const malScraper = require('mal-scraper');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['mal', 'myanimelist'],
			description: 'Searches information from my anime list.',
			category: 'miscellaneous',
			usage: '<query>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) return this.client.embeds.common('commonError', message, 'Please specify an anime to search!');

		malScraper.getInfoFromName(query).then(data => {
			if (data.length === 0) return this.client.embeds.common('commonError', message, 'Can\'t search, make sure the anime title is correct');
			const embed = new MessageEmbed()
				.setColor(Colors.MAL)
				.setAuthor('MyAnimeList Search Engine', 'https://i.imgur.com/QABhOrL.png', 'https://myanimelist.net/')
				.setTitle(data.title)
				.setURL(data.url)
				.setThumbnail(data.picture)
				.setDescription(data.synopsis)
				.addField('__Details__', stripIndents`
                    ***English title:*** ${data.englishTitle || 'Unknown'}
                    ***Japanese title:*** ${data.japaneseTitle}
                    ***Synonyms:*** ${data.synonyms || 'Unknown'}
                    ***Score:*** ${data.score} (${data.scoreStats})
                    ***Genres:*** ${data.genres.join(', ').toString()}
                    ***Rating:*** ${data.rating}
                    ***Source:*** ${data.source}
                    ***Type:*** ${data.type}
                    ***Episodes:*** ${data.episodes}
                    ***Duration:*** ${data.duration}
                    ***Aired:*** ${data.aired}
                    ***Status:*** ${data.status}`)
				.setFooter(`Responded in ${this.client.functions.responseTime(message)} | Powered by MyAnimeList`, message.author.avatarURL({ dynamic: true }));

			message.channel.send(embed);
		}).catch(() => this.client.embeds.common('APIError', message));
	}

};
