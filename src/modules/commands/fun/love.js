const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'love',
			aliases: ['affinity'],
			description: 'Shows how in love you are with a user.',
			category: 'fun',
			usage: '<Mention | ID>',
			guildOnly: true,
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
		});
	}

	async run(message, args) {
		let person = this.client.functions.getMember(message, args[0]);

		if (!person || message.author.id === person.id) {
			person = message.guild.members.cache.filter(msg => msg.id !== message.author.id).random();
		}

		const love = Math.random() * 100;
		const loveIndex = Math.floor(love / 10);
		const loveLevel = '💖'.repeat(loveIndex) + '💔'.repeat(10 - loveIndex);

		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setDescription(stripIndents`
                **${message.member.displayName}** is ${Math.floor(love)}% in love with **${person.displayName}**
                ${loveLevel}`)
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	}

};
