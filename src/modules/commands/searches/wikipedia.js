const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['wiki'],
			description: 'Searches Wikipedia Article use title',
			category: 'searches',
			usage: '<query>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			message.channel.send('Please provide query to search on Wikipedia');
			return;
		}

		const headers = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36' };
		axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`, { headers }).then(res => {
			const article = res.data;

			const embed = new MessageEmbed()
				.setColor(Colors.WIKIPEDIA)
				.setAuthor('Wikipedia Search Engine', 'https://i.imgur.com/C665mkB.png', 'https://en.wikipedia.org/')
				.setTitle(article.title)
				.setURL(article.content_urls.desktop.page)
				.setThumbnail(article.originalimage ? article.originalimage.source : null)
				.setDescription(article.extract)
				.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by Wikipedia`, message.author.avatarURL({ dynamic: true }));

			message.channel.send(embed);
		}).catch(() => message.channel.send('I couldn\'t find a wikipedia article with that title!'));
	}

};
