const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Access, Colors } = require('../../../structures/Configuration.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(Access.YOUTUBE);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'youtube',
			aliases: ['yt'],
			description: 'Searches for a video on youtube',
			category: 'searches',
			usage: '<query>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			message.channel.send('You must provide a search query!');
			return;
		}

		youtube.searchVideos(`${query}`, 1).then(res => {
			const embed = new MessageEmbed()
				.setColor(Colors.YOUTUBE)
				.setAuthor('YouTube Search Engine', 'https://i.imgur.com/lbS6Vil.png', 'https://youtube.com/')
				.setTitle(res[0].title)
				.setURL(res[0].shortURL)
				.setImage(res[0].thumbnails.high.url)
				.addField(res[0].channel.title, res[0].description)
				.setFooter(`Responded in ${this.client.functions.responseTime(message)} | Powered by YouTube`, message.author.avatarURL({ dynamic: true }))
				.setTimestamp(new Date(res[0].publishedAt));

			message.channel.send(embed);
		});
	}

};
