const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Configuration.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['wiki'],
			description: 'Shows short information articles from Wikipedia.',
			category: 'Miscellaneous',
			usage: '[searchQuery]',
			cooldown: 3000
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			return message.reply({ content: 'Please enter the article title to search!' });
		}

		try {
			const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
			const data = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`, { headers }).then(res => res.data);

			const embed = new MessageEmbed()
				.setColor(Color.WIKIPEDIA)
				.setAuthor('Wikipedia', 'https://i.imgur.com/C665mkB.png', 'https://en.wikipedia.org/')
				.setTitle(data.title)
				.setURL(data.content_urls.desktop.page)
				.setThumbnail(data.originalimage ? data.originalimage.source : null)
				.setDescription(data.extract)
				.setFooter('Powered by Wikipedia', message.author.avatarURL({ dynamic: true }));

			return message.reply({ embeds: [embed] });
		} catch {
			return message.reply({ content: 'Couldn\'t find a wikipedia article with that title!' });
		}
	}

};
