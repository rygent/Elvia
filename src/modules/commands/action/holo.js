const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const Client = require('nekos.life');
const { sfw } = new Client();

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'holo',
			aliases: ['kemo'],
			description: 'Gives you a holo!',
			category: 'action',
			usage: '[Mention]',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
		});
	}

	async run(message) {
		const mention = message.mentions.users.first();
		const roleColor = message.guild.me.roles.highest.hexColor;

		message.channel.startTyping(true);
		sfw.holo().then(async res => {
			const embed = new MessageEmbed()
				.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
				.setDescription(`Have an image of Holo ${message.author}.`)
				.setImage(res.url)
				.setFooter(`Responded in ${this.client.functions.responseTime(message)} | Powered by nekos.life`, message.author.avatarURL({ dynamic: true }));

			if (mention && mention !== message.author) {
				embed.setDescription(`${message.author} likes Holo a lot, so ${mention} should like her in the same way.`);
			}

			message.channel.send(embed);
		});
		message.channel.stopTyping(true);
	}

};
