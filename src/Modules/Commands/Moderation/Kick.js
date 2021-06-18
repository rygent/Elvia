const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Kick certain users from the server!',
			category: 'Moderation',
			usage: '[member] [reason]',
			userPerms: ['KICK_MEMBERS'],
			clientPerms: ['KICK_MEMBERS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args]) {
		const member = message.mentions.members.last() || message.guild.members.cache.get(target);
		if (!member) return message.reply('Please specify a valid member to kick!');

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const memberData = await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id });

		if (member.id === message.author.id) return message.reply('You can\'t kick yourself!');
		if (message.guild.member(message.author).roles.highest.position <= message.guild.member(member).roles.highest.position) {
			return message.reply('You can\'t kick a member who has an higher or equal role hierarchy to yours!');
		}

		const reason = args.join(' ');
		if (!reason) return message.reply('Please enter a reason!');

		if (!message.guild.member(member).kickable) {
			return message.reply(`I can't kick **${member.user.username}**! For having a higher role than mine!`);
		}

		if (!member.user.bot) {
			await member.send(`Hello <@${member.id}>,\nYou've just been kicked from **${message.guild.name}** by **${message.author.tag}** because of **${reason}**!`);
		}

		member.kick(`${message.author.tag}: ${reason}`).then(() => {
			message.reply(`**${member.user.username}** has just been kicked from **${message.guild.name}** by **${message.author.tag}** because of **${reason}**!`);

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

				const embed = new MessageEmbed()
					.setColor(Colors.ORANGE)
					.setAuthor(`Moderation: Kick | Case #${guildData.casesCount}`, member.user.avatarURL({ dynamic: true }))
					.setDescription([
						`***User:*** ${member.user.tag} (\`${member.user.id}\`)`,
						`***Moderator:*** ${message.author.tag} (\`${message.author.id}\`)`,
						`***Reason:*** ${reason}`
					].join('\n'))
					.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

				sendChannel.send({ embeds: [embed] });
			}
		});
	}

};
