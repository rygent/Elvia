const Command = require('../../Structures/Command.js');
const { Formatters, MessageEmbed } = require('discord.js');
const { Api, Color } = require('../../Utils/Setting.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(Api.Youtube);

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
				.setDescription([
					`**${data[0].channel.title}**`,
					`${data[0].description}\n`,
					`***Published:*** ${Formatters.time(new Date(data[0].publishedAt))}`
				].join('\n'))
				.setImage(data[0].thumbnails.high.url)
				.setFooter(`${message.author.username}  •  Powered by YouTube`, message.author.avatarURL({ dynamic: true }));

			return message.reply({ embeds: [embed] });
		} catch {
			return message.reply({ content: 'No results found!' });
		}
	}

};
