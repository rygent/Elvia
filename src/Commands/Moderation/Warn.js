const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');
const Resolver = require('../../Modules/Resolver.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Give warning to members!',
			category: 'Moderation',
			usage: '[member] [reason]',
			memberPerms: ['MANAGE_MESSAGES'],
			clientPerms: ['MANAGE_MESSAGES'],
			cooldown: 3000
		});
	}

	async run(message, [target, ...args], data) {
		const member = await Resolver.resolveMember({ message, target });
		if (!member) return message.reply({ content: 'Please specify valid member to warn!' });
		if (member.user.bot) return message.reply({ content: 'This user is a bot!' });

		if (member.id === message.author.id) return message.reply({ content: 'You can\'t warn yourself!' });
		const memberPosition = member.roles.highest.position;
		const moderationPosition = message.member.roles.highest.position;
		if (message.member.ownerID !== message.author.id && !(moderationPosition > memberPosition)) {
			return message.reply({ content: 'You can\'t warn a member who has an higher or equal role hierarchy to yours!' });
		}

		const reason = args.join(' ');
		if (!reason) return message.reply({ content: 'Please enter a reason!' });

		const sanctions = data.member.sanctions.filter((sanction) => sanction.type === 'warn').length;
		const banCount = data.guild.plugins.warnsSanctions.ban;
		const kickCount = data.guild.plugins.warnsSanctions.kick;

		data.guild.casesCount++;
		data.guild.save();

		const caseInfo = {
			channel: message.channel.id,
			moderator: message.author.id,
			date: Date.now(),
			type: 'warn',
			case: data.guild.casesCount,
			reason
		};

		const embed = new MessageEmbed()
			.setColor(Color.YELLOW)
			.setDescription([
				`***User:*** ${member.user.tag} (\`${member.user.id}\`)`,
				`***Moderator:*** ${message.author.tag} (\`${message.author.id}\`)`,
				`***Reason:*** ${reason}`
			].join('\n'))
			.setFooter(this.client.user.username, this.client.user.avatarURL({ dynamic: true }));

		if (banCount) {
			if (sanctions >= banCount) {
				member.send({ content: `Hello <@${member.id}>,\nYou've just been banned from **${message.guild.name}** by **${message.author.tag}** because of **${reason}**!` });
				caseInfo.type = 'ban';
				embed.setAuthor(`Moderation: Ban | Case #${data.guild.casesCount}`, member.user.avatarURL({ dynamic: true }));
				embed.setColor(Color.RED);
				message.guild.members.ban(member);
				message.reply({ content: `**${member.user.tag}** was automatically banned because they reach more than **${banCount}** warns!` });
			}
		} else if (kickCount) {
			if (sanctions >= kickCount) {
				member.send({ content: `Hello <@${member.id}>,\nYou've just been kicked from **${message.guild.name}** by **${message.author.tag}** because of **${reason}**!` });
				caseInfo.type = 'kick';
				embed.setAuthor(`Moderation: Kick | Case #${data.guild.casesCount}`, member.user.avatarURL({ dynamic: true }));
				embed.setColor(Color.ORANGE);
				member.kick(member);
				message.reply({ content: `**${member.user.tag}** was automatically kicked because they reach more than **${kickCount}** warns!` });
			}
		} else {
			member.send({ content: `Hello <@${member.id}>,\nYou've just been warned on **${message.guild.name}** by **${message.author.tag}** for **${reason}**!` });
			caseInfo.type = 'warn';
			embed.setAuthor(`Moderation: Warn | Case #${data.guild.casesCount}`, member.user.avatarURL({ dynamic: true }));
			message.reply({ content: `**${member.user.tag}** has been warned in private messages for **${reason}**!` });
		}

		data.member.sanctions.push(caseInfo);
		data.member.save();

		if (data.guild.plugins.moderations) {
			const sendChannel = message.guild.channels.cache.get(data.guild.plugins.moderations);
			if (!sendChannel) return;
			sendChannel.send({ embeds: [embed] });
		}
	}

};
