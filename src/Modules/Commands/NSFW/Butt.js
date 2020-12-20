const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Posts a random Butt picture. Warning this commands for 18+',
			category: 'NSFW',
			nsfw: true,
			cooldown: 10000
		});
	}

	async run(message) {
		const headers = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36' };
		const data = await axios.get(`http://api.obutts.ru/butts/0/1/random`, { headers }).then(res => res.data);

		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setDescription(`[Click here if the image failed to load.](http://media.obutts.ru/${data[0].preview})`)
			.setImage(`http://media.obutts.ru/${data[0].preview}`)
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		return message.channel.send(embed);
	}

};
