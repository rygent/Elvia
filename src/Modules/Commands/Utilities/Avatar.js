const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['av'],
			description: 'Sends the mentioned user\'s avatar.',
			category: 'Utilities',
			usage: '[Mention | ID]',
			cooldown: 5000
		});
	}

	async run(message, [target]) {
		const user = await this.client.resolveUser(target) || message.author;

		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setTitle(user.tag)
			.setDescription([
				`\`ID: ${user.id}\``,
				`[Click Here to download](${user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })})`
			].join('\n'))
			.setImage(user.displayAvatarURL({ format: 'png', dynamic: true, size: 512 }))
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		return message.channel.send(embed);
	}

};
