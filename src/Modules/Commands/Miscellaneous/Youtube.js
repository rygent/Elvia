const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Access, Colors } = require('../../../Structures/Configuration.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(Access.YOUTUBE);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['yt'],
			description: 'Searches for a video on youtube',
			category: 'Miscellaneous',
			usage: '<querySearch>',
			disabled: true,
			cooldown: 5000
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			return message.quote('Please provide query to search on YouTube');
		}

		try {
			const data = await youtube.searchVideos(`${query}`, 1);

			const embed = new MessageEmbed()
				.setColor(Colors.YOUTUBE)
				.setAuthor('YouTube Search Engine', 'https://i.imgur.com/lbS6Vil.png', 'https://youtube.com/')
				.setTitle(data[0].title)
				.setURL(data[0].shortURL)
				.setImage(data[0].thumbnails.high.url)
				.addField(data[0].channel.title, data[0].description)
				.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by YouTube`, message.author.avatarURL({ dynamic: true }))
				.setTimestamp(new Date(data[0].publishedAt));

			return message.channel.send(embed);
		} catch {
			return message.quote('No results were found!');
		}
	}

};
