const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color, Environment } = require('../../Utils/Configuration.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(Environment.YOUTUBE);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['yt'],
			description: 'Searches for a video on youtube',
			category: 'Miscellaneous',
			usage: '[searchQuery]',
			cooldown: 3000
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			return message.reply({ content: 'Please enter a query to search!' });
		}

		try {
			const data = await youtube.searchVideos(`${query}`, 1);

			const embed = new MessageEmbed()
				.setColor(Color.YOUTUBE)
				.setAuthor('YouTube', 'https://i.imgur.com/lbS6Vil.png', 'https://youtube.com/')
				.setTitle(data[0].title)
				.setURL(data[0].shortURL)
				.setImage(data[0].thumbnails.high.url)
				.addField(data[0].channel.title, data[0].description)
				.setFooter('Powered by YouTube', message.author.avatarURL({ dynamic: true }))
				.setTimestamp(new Date(data[0].publishedAt));

			return message.reply({ embeds: [embed] });
		} catch {
			return message.reply({ content: 'No results found!' });
		}
	}

};
