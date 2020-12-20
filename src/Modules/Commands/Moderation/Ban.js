const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['banish', 'permban'],
			description: 'Bans the given user and DMs them the reason!',
			category: 'Moderation',
			usage: '<Mention | ID> <reason>',
			userPerms: ['BAN_MEMBERS'],
			clientPerms: ['BAN_MEMBERS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args]) {
		const member = message.mentions.members.last() || message.guild.members.cache.get(target);
		if (!member) return message.quote('Please mention a valid member!');

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const memberData = message.guild.members.cache.get(member.id) ? await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id }) : null;

		if (member.id === this.client.user.id) return message.quote('Please don\'t banned me...!');
		if (member.id === message.author.id) return message.quote('You can\'t banned yourself!');
		if (member.id === this.client.owner) return message.quote('I can\'t banned my master');
		if (message.guild.member(message.author).roles.highest.position <= message.guild.member(member).roles.highest.position) {
			return message.quote(`You can't banned **${member.user.username}**! Their position is higher than you!`);
		}

		const reason = args.join(' ');
		if (!reason) return message.quote('Please provide a reason');

		if (!message.guild.member(member).bannable) {
			return message.quote(`I can't banned **${member.user.username}**! Their role is higher than mine!`);
		}

		if (!member.user.bot) {
			const embed = new MessageEmbed()
				.setColor(Colors.RED)
				.setTitle('🚫 Banned')
				.setDescription([
					`Hello <@${member.id}>,`,
					`You have just been banned from **${message.guild.name}** by **${message.author.tag}**`,
					`Reason: **${reason}**\n`,
					`__*Please make sure you always follow the rules, because not doing so can result in punishment.*__`
				].join('\n'))
				.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

			member.send(embed);
		}

		message.guild.members.ban(member, { reason: `${message.author.tag}: ${reason}` }).then(() => {
			message.quote(`**${member.user.username}**, has been banned.`);

			const caseInfo = {
				channel: message.channel.id,
				moderator: message.author.id,
				date: Date.now(),
				type: 'ban',
				case: guildData.casesCount,
				reason
			};

			if (memberData) {
				memberData.sanctions.push(caseInfo);
				memberData.save();
			}

			guildData.casesCount++;
			guildData.save();

			if (guildData.plugins.moderations) {
				const sendChannel = message.guild.channels.cache.get(guildData.plugins.moderations);
				if (!sendChannel) return;

				const roleColor = message.guild.me.roles.highest.hexColor;

				const embed = new MessageEmbed()
					.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
					.setAuthor(`Moderation: Ban | Case #${guildData.casesCount}`, member.user.avatarURL({ dynamic: true }))
					.setDescription([
						`***User:*** ${member.user.tag} (${member.user.id})`,
						`***Moderator:*** ${message.author.tag} (${message.author.id})`,
						`***Reason:*** ${reason}`
					].join('\n'))
					.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

				sendChannel.send(embed);
			}
		});
	}

};
