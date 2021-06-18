const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Give warning to members!',
			category: 'Moderation',
			usage: '[member] [reason]',
			userPerms: ['MANAGE_MESSAGES'],
			clientPerms: ['MANAGE_MESSAGES'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args]) {
		const member = await this.client.resolveMember(target, message.guild);
		if (!member) return message.reply('Please specify valid member to warn!');
		if (member.user.bot) return message.reply('This user is a bot!');

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const memberData = await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id });

		if (member.id === message.author.id) return message.reply('You can\'t warn yourself!');
		const memberPosition = member.roles.highest.position;
		const moderationPosition = message.member.roles.highest.position;
		if (message.member.ownerID !== message.author.id && !(moderationPosition > memberPosition)) {
			return message.reply('You can\'t warn a member who has an higher or equal role hierarchy to yours!');
		}

		const reason = args.join(' ');
		if (!reason) return message.reply('Please enter a reason!');

		const sanctions = memberData.sanctions.filter((sanction) => sanction.type === 'warn').length;
		const banCount = guildData.plugins.warnsSanctions.ban;
		const kickCount = guildData.plugins.warnsSanctions.kick;

		guildData.casesCount++;
		guildData.save();

		const caseInfo = {
			channel: message.channel.id,
			moderator: message.author.id,
			date: Date.now(),
			type: 'warn',
			case: guildData.casesCount,
			reason
		};

		const embed = new MessageEmbed()
			.setColor(Colors.YELLOW)
			.setDescription([
				`***User:*** ${member.user.tag} (\`${member.user.id}\`)`,
				`***Moderator:*** ${message.author.tag} (\`${message.author.id}\`)`,
				`***Reason:*** ${reason}`
			].join('\n'))
			.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

		if (banCount) {
			if (sanctions >= banCount) {
				member.send(`Hello <@${member.id}>,\nYou've just been banned from **${message.guild.name}** by **${message.author.tag}** because of **${reason}**!`);
				caseInfo.type = 'ban';
				embed.setAuthor(`Moderation: Ban | Case #${guildData.casesCount}`, member.user.avatarURL({ dynamic: true }));
				embed.setColor(Colors.RED);
				message.guild.members.ban(member);
				message.reply(`**${member.user.tag}** was automatically banned because they reach more than **${banCount}** warns!`);
			}
		} else if (kickCount) {
			if (sanctions >= kickCount) {
				member.send(`Hello <@${member.id}>,\nYou've just been kicked from **${message.guild.name}** by **${message.author.tag}** because of **${reason}**!`);
				caseInfo.type = 'kick';
				embed.setAuthor(`Moderation: Kick | Case #${guildData.casesCount}`, member.user.avatarURL({ dynamic: true }));
				embed.setColor(Colors.ORANGE);
				member.kick(member);
				message.reply(`**${member.user.tag}** was automatically kicked because they reach more than **${kickCount}** warns!`);
			}
		} else {
			member.send(`Hello <@${member.id}>,\nYou've just been warned on **${message.guild.name}** by **${message.author.tag}** for **${reason}**!`);
			caseInfo.type = 'warn';
			embed.setAuthor(`Moderation: Warn | Case #${guildData.casesCount}`, member.user.avatarURL({ dynamic: true }));
			message.reply(`**${member.user.tag}** has been warned in private messages for **${reason}**!`);
		}

		memberData.sanctions.push(caseInfo);
		memberData.save();

		if (guildData.plugins.moderations) {
			const sendChannel = message.guild.channels.cache.get(guildData.plugins.moderations);
			if (!sendChannel) return;
			sendChannel.send({ embeds: [embed] });
		}
	}

};
