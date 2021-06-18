const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['wiki'],
			description: 'Shows short information articles from Wikipedia.',
			category: 'Miscellaneous',
			usage: '[searchQuery]',
			cooldown: 5000
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			return message.quote('Please enter the article title to search!');
		}

		try {
			const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
			const data = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`, { headers }).then(res => res.data);

			const embed = new MessageEmbed()
				.setColor(Colors.WIKIPEDIA)
				.setAuthor('Wikipedia Search Engine', 'https://i.imgur.com/C665mkB.png', 'https://en.wikipedia.org/')
				.setTitle(data.title)
				.setURL(data.content_urls.desktop.page)
				.setThumbnail(data.originalimage ? data.originalimage.source : null)
				.setDescription(data.extract)
				.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by Wikipedia`, message.author.avatarURL({ dynamic: true }));

			return message.channel.send({ embeds: [embed] });
		} catch {
			return message.quote('Couldn\'t find a wikipedia article with that title!');
		}
	}

};
