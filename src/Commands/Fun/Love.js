const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['affinity'],
			description: 'Show your love to other members.',
			category: 'Fun',
			usage: '[member]',
			cooldown: 3000
		});
	}

	async run(message, [target]) {
		let person = message.mentions.members.last() || message.guild.members.cache.get(target);

		if (!person || message.author.id === person.id) {
			person = message.guild.members.cache.filter(msg => msg.id !== message.author.id).random();
		}

		const love = Math.random() * 100;
		const loveIndex = Math.floor(love / 10);
		const loveLevel = '💖'.repeat(loveIndex) + '💔'.repeat(10 - loveIndex);

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setDescription([
				`**${message.member.displayName}** is ${Math.floor(love)}% in love with **${person.displayName}**`,
				`${loveLevel}`
			].join('\n'))
			.setFooter(`${message.author.username}  •  Powered by ${this.client.user.username}`, message.author.avatarURL({ dynamic: true }));

		return message.reply({ embeds: [embed] });
	}

};
