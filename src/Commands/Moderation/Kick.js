const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Kick certain users from the server!',
			category: 'Moderation',
			usage: '[member] [reason]',
			memberPerms: ['KICK_MEMBERS'],
			clientPerms: ['KICK_MEMBERS'],
			cooldown: 3000
		});
	}

	async run(message, [target, ...args]) {
		const member = message.mentions.members.last() || message.guild.members.cache.get(target);
		if (!member) return message.reply({ content: 'Please specify a valid member to kick!' });

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const memberData = await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id });

		if (member.id === message.author.id) return message.reply({ content: 'You can\'t kick yourself!' });
		if (message.guild.members.cache.get(message.author.id).roles.highest.position <= message.guild.members.cache.get(member.id).roles.highest.position) {
			return message.reply({ content: 'You can\'t kick a member who has an higher or equal role hierarchy to yours!' });
		}

		const reason = args.join(' ');
		if (!reason) return message.reply({ content: 'Please enter a reason!' });

		if (!message.guild.members.cache.get(member.id).kickable) {
			return message.reply({ content: `I can't kick **${member.user.username}**! For having a higher role than mine!` });
		}

		if (!member.user.bot) {
			await member.send({ content: `Hello <@${member.id}>,\nYou've just been kicked from **${message.guild.name}** by **${message.author.tag}** because of **${reason}**!` });
		}

		member.kick(`${message.author.tag}: ${reason}`).then(() => {
			message.reply({ content: `**${member.user.username}** has just been kicked from **${message.guild.name}** by **${message.author.tag}** because of **${reason}**!` });

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
					.setColor(Color.ORANGE)
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
