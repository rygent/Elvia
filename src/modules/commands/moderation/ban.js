const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['banish', 'permban'],
			description: 'Bans the given user and DMs them the reason!',
			category: 'moderation',
			usage: '<mention|id> <reason>',
			memberPerms: ['BAN_MEMBERS'],
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args], data) {
		const member = message.mentions.members.last() || message.guild.members.cache.get(target);
		if (!member) return this.client.embeds.common('commonError', message, 'Please mention a valid member!');

		const memberData = message.guild.members.cache.get(member.id) ? await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id }) : null;

		if (member.id === this.client.user.id) return this.client.embeds.common('commonError', message, 'Please don\'t banned me...!');
		if (member.id === message.author.id) return this.client.embeds.common('commonError', message, 'You can\'t banned yourself!');
		if (member.id === this.client.owner) return this.client.embeds.common('commonError', message, 'I can\'t banned my master');
		if (message.guild.member(message.author).roles.highest.position <= message.guild.member(member).roles.highest.position) {
			return this.client.embeds.common('commonError', message, `You can't banned **${member.user.username}**! Their position is higher than you!`);
		}

		const reason = args.join(' ');
		if (!reason) return this.client.embeds.common('commonError', message, 'Please provide a reason');


		if (!message.guild.member(member).bannable) {
			return this.client.embeds.common('commonError', message, `I can't banned **${member.user.username}**! Their role is higher than mine!`);
		}

		if (!member.user.bot) {
			const embed = new MessageEmbed()
				.setColor(Colors.RED)
				.setTitle('🚫 Banned')
				.setDescription(stripIndents`
					Hello <@${member.id}>,
					You have just been banned from **${message.guild.name}** by **${message.author.tag}**
                    Reason: **${reason}**\n
					__*Please make sure you always follow the rules, because not doing so can result in punishment.*__
				`)
				.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

			member.send(embed);
		}

		message.guild.members.ban(member, { reason: `${message.author.tag}: ${reason}` }).then(() => {
			this.client.embeds.common('commonSuccess', message, `**${member.user.username}**, has been banned.`);

			const caseInfo = {
				channel: message.channel.id,
				moderator: message.author.id,
				date: Date.now(),
				type: 'ban',
				case: data.guild.casesCount,
				reason
			};

			if (memberData) {
				memberData.sanctions.push(caseInfo);
				memberData.save();
			}

			data.guild.casesCount++;
			data.guild.save();

			if (data.guild.plugins.modlogs) {
				const sendChannel = message.guild.channels.cache.get(data.guild.plugins.modlogs);
				if (!sendChannel) return;

				const roleColor = message.guild.me.roles.highest.hexColor;

				const embed = new MessageEmbed()
					.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
					.setAuthor(`Moderation: Ban | Case #${data.guild.casesCount}`, member.user.avatarURL({ dynamic: true }))
					.setDescription(stripIndents`
						***User:*** ${member.user.tag} (${member.user.id})
						***Moderator:*** ${message.author.tag} (${message.author.id})
						***Reason:*** ${reason}
					`)
					.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

				sendChannel.send(embed);
			}
		});
	}

};
