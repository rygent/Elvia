const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const Client = require('nekos.life');
const { sfw } = new Client();

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['waif'],
			description: 'Finds you a waifu.',
			category: 'image',
			usage: '',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	/* eslint-disable consistent-return */
	async run(message) {
		const msg = await message.channel.send('Generating...');
		const roleColor = message.guild.me.roles.highest.hexColor;

		sfw.waifu().then(async res => {
			const embed = new MessageEmbed()
				.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
				.setDescription(`${message.author} this is your waifu.`)
				.setImage(res.url)
				.setFooter(`Responded in ${this.client.functions.responseTime(msg)} | Powered by nekos.life`, message.author.avatarURL({ dynamic: true }));

			msg.edit('\u200B', embed);
		});
	}

};
