const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Returns a meme.',
			category: 'Fun',
			cooldown: 3000
		});
	}

	async run(message) {
		const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
		const data = await axios.get('https://meme-api.herokuapp.com/gimme', { headers }).then(res => res.data);

		const embed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setTitle(data.title)
			.setDescription(`[Click here if the image failed to load.](${data.url})`)
			.setImage(data.url)
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		return message.reply({ embeds: [embed] });
	}

};
