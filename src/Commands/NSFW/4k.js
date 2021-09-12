const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Post random "4K" images. This command contains NSFW!',
			category: 'NSFW',
			cooldown: 10000,
			nsfw: true
		});
	}

	async run(message) {
		const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
		const result = await axios.get(`https://nekobot.xyz/api/image?type=4k`, { headers }).then(res => res.data);

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setDescription(`[Click here if the image failed to load.](${result.message})`)
			.setImage(result.message)
			.setFooter(`${message.author.username}  •  Powered by ${this.client.user.username}`, message.author.avatarURL({ dynamic: true }));

		return message.reply({ embeds: [embed] });
	}

};
