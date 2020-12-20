const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['wiki'],
			description: 'Searches Wikipedia Article use title',
			category: 'Miscellaneous',
			usage: '<querySearch>',
			cooldown: 5000
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			return message.quote('Please provide query to search on Wikipedia');
		}

		try {
			const headers = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36' };
			const data = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`, { headers }).then(res => res.data);

			const embed = new MessageEmbed()
				.setColor(Colors.WIKIPEDIA)
				.setAuthor('Wikipedia Search Engine', 'https://i.imgur.com/C665mkB.png', 'https://en.wikipedia.org/')
				.setTitle(data.title)
				.setURL(data.content_urls.desktop.page)
				.setThumbnail(data.originalimage ? data.originalimage.source : null)
				.setDescription(data.extract)
				.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by Wikipedia`, message.author.avatarURL({ dynamic: true }));

			return message.channel.send(embed);
		} catch {
			return message.quote('I couldn\'t find a wikipedia article with that title!');
		}
	}

};
