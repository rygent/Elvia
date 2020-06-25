const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const Client = require('nekos.life');
const { sfw } = new Client();

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'tickle',
			aliases: [],
			description: 'Gives you a tickle!',
			category: 'action',
			usage: '[Mention]',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
		});
	}

	async run(message) {
		const mention = message.mentions.users.first();
		const roleColor = message.guild.me.roles.highest.hexColor;

		message.channel.startTyping(true);
		sfw.tickle().then(async res => {
			const embed = new MessageEmbed()
				.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
				.setDescription(`${message.author} has been tickled by me.`)
				.setImage(res.url)
				.setFooter(`Responded in ${this.client.functions.responseTime(message)} | Powered by nekos.life`, message.author.avatarURL({ dynamic: true }));

			if (mention && mention !== message.author) {
				embed.setDescription(`${message.author} just tickled ${mention}.`);
			}

			message.channel.send(embed);
		});
		message.channel.stopTyping(true);
	}

};
