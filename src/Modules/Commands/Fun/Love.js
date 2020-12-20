const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['affinity'],
			description: 'Shows how in love you are with a user.',
			category: 'Fun',
			usage: '<Mention | ID>',
			cooldown: 5000
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

		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setDescription([
				`**${message.member.displayName}** is ${Math.floor(love)}% in love with **${person.displayName}**`,
				`${loveLevel}`
			])
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	}

};
