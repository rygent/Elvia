const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['boot'],
			description: 'Kicks the given user and DMs them the reason!',
			category: 'Moderation',
			usage: '<Mention | ID> <reason>',
			userPerms: ['KICK_MEMBERS'],
			clientPerms: ['KICK_MEMBERS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args]) {
		const member = message.mentions.members.last() || message.guild.members.cache.get(target);
		if (!member) return message.quote('Please mention a valid member!');

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const memberData = await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id });

		if (member.id === this.client.user.id) return message.quote('Please don\'t kick me...!');
		if (member.id === message.author.id) return message.quote('You can\'t kick yourself!');
		if (member.id === this.client.owner) return message.quote('I can\'t kick my master');
		if (message.guild.member(message.author).roles.highest.position <= message.guild.member(member).roles.highest.position) {
			return message.quote(`You can't kick **${member.user.username}**! Their position is higher than you!`);
		}

		const reason = args.join(' ');
		if (!reason) return message.quote('Please provide a reason');

		if (!message.guild.member(member).kickable) {
			return message.quote(`I can't kick **${member.user.username}**! Their role is higher than mine!`);
		}

		if (!member.user.bot) {
			const embed = new MessageEmbed()
				.setColor(Colors.ORANGE)
				.setTitle('👢 Kicked')
				.setDescription([
					`Hello <@${member.id}>,`,
					`You have just been kicked out from **${message.guild.name}** by **${message.author.tag}**`,
					`Reason: **${reason}**\n`,
					`__*Please make sure you always follow the rules, because not doing so can result in punishment.*__`
				].join('\n'))
				.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

			member.send(embed);
		}

		member.kick(`${message.author.tag}: ${reason}`).then(() => {
			message.quote(`**${member.user.username}**, has been kicked out.`);

			guildData.casesCount++;
			guildData.save();

			const caseInfo = {
				channel: message.channel.id,
				moderator: message.author.id,
				date: Date.now(),
				type: 'kick',
				case: guildData.casesCount,
				reason
			};

			memberData.sanctions.push(caseInfo);
			memberData.save();

			if (guildData.plugins.moderations) {
				const sendChannel = message.guild.channels.cache.get(guildData.plugins.moderations);
				if (!sendChannel) return;

				const roleColor = message.guild.me.roles.highest.hexColor;

				const embed = new MessageEmbed()
					.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
					.setAuthor(`Moderation: Kick | Case #${guildData.casesCount}`, member.user.avatarURL({ dynamic: true }))
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
