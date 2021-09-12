const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');
const Resolver = require('../../Modules/Resolver.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['av'],
			description: 'Showing avatar of the mentioned user!',
			category: 'Utilities',
			usage: '(member)',
			cooldown: 3000
		});
	}

	async run(message, [target]) {
		const user = await Resolver.resolveUser({ message, target }) || message.author;

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setDescription([
				`\`ID: ${user.id}\``,
				`[Click here to download](${user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })})`
			].join('\n'))
			.setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setFooter(`${message.author.username}  •  Powered by ${this.client.user.username}`, message.author.avatarURL({ dynamic: true }));

		return message.reply({ embeds: [embed] });
	}

};
