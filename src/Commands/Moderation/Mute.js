const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');
const Resolver = require('../../Modules/Resolver.js');
const moment = require('moment');
const ms = require('ms');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Restrict members from sending messages and voice chats for a certain period of time!',
			category: 'Moderation',
			usage: '[member] [duration] [reason]',
			memberPerms: ['MANAGE_MESSAGES'],
			clientPerms: ['MANAGE_CHANNELS'],
			cooldown: 3000
		});
	}

	async run(message, [target, time, ...args], data) {
		const member = await Resolver.resolveMember({ message, target });
		if (!member) return message.reply({ content: 'Please specify a valid member to mute!' });
		if (member.id === message.author.id) return message.reply({ content: 'You can\'t mute yourself!' });
		const memberPosition = member.roles.highest.position;
		const moderationPosition = message.member.roles.highest.position;
		if (message.member.ownerID !== message.author.id && !(moderationPosition > memberPosition)) {
			return message.reply({ content: 'You can\'t mute a member who has an higher or equal role hierarchy to yours!' });
		}

		if (!time || isNaN(ms(time))) return message.reply({ content: 'You must enter a valid time! Available units: `s`, `m`, `h` or `d`' });

		const reason = args.join(' ');
		if (!reason) return message.reply({ content: 'Please enter a reason!' });

		message.guild.channels.cache.forEach((channel) => {
			channel.updateOverwrite(member.id, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false,
				CONNECT: false
			});
		});

		member.send({ content: `Hello <@${member.user.id}>,\nYou've just been muted on **${message.guild.name}** by **${message.author.tag}** for **${time}** because of **${reason}**!` });
		message.reply({ content: `**${member.user.username}** is now muted for **${time}** because of **${reason}**!` });

		data.guild.casesCount++;

		const caseInfo = {
			channel: message.channel.id,
			moderator: message.author.id,
			date: Date.now(),
			type: 'mute',
			case: data.guild.casesCount,
			reason,
			time
		};

		data.member.mute.muted = true;
		data.member.mute.endDate = Date.now() + ms(time);
		data.member.mute.case = data.guild.casesCount;
		data.member.sanctions.push(caseInfo);

		data.member.markModified('sanctions');
		data.member.markModified('mute');
		await data.member.save();

		await data.guild.save();

		this.client.databaseCache.mutedUsers.set(`${member.id}${message.guild.id}`, data.member);

		if (data.guild.plugins.moderations) {
			const sendChannel = message.guild.channels.cache.get(data.guild.plugins.moderations);
			if (!sendChannel) return;

			const embed = new MessageEmbed()
				.setColor(Color.GREY)
				.setAuthor(`Moderation: Mute | Case #${data.guild.casesCount}`, member.user.avatarURL({ dynamic: true }))
				.setDescription([
					`***User:*** ${member.user.tag} (\`${member.user.id}\`)`,
					`***Moderator:*** ${message.author.tag} (\`${message.author.id}\`)`,
					`***Duration:*** ${ms(ms(time), { long: true })}`,
					`***Expiry:*** ${moment.utc(Date.now() + ms(time)).format('dddd, MMM D, YYYY HH:mm z')}`,
					`***Reason:*** ${reason}`
				].join('\n'))
				.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

			sendChannel.send({ embeds: [embed] });
		}
	}

};
