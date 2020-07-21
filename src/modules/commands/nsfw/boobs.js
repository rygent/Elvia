const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'boobs',
			aliases: ['boob', 'tits'],
			description: 'Posts a random boobs picture. Warning this commands for 18+',
			category: 'nsfw',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			nsfw: true
		});
	}

	async run(message) {
		const roleColor = message.guild.me.roles.highest.hexColor;

		const id = [Math.floor(Math.random() * 10930)];
		const headers = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36' };
		const result = await axios.get(`http://api.oboobs.ru/boobs/${id}`, { headers });
		const { preview } = result.data[0];

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setImage(`http://media.oboobs.ru/${preview}`)
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	}

};
