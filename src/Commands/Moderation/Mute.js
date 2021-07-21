const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Configuration.js');
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

	async run(message, [target, time, ...args]) {
		const member = await this.client.resolveMember(target, message.guild);
		if (!member) return message.reply({ content: 'Please specify a valid member to mute!' });
		if (member.id === message.author.id) return message.reply({ content: 'You can\'t mute yourself!' });
		const memberPosition = member.roles.highest.position;
		const moderationPosition = message.member.roles.highest.position;
		if (message.member.ownerID !== message.author.id && !(moderationPosition > memberPosition)) {
			return message.reply({ content: 'You can\'t mute a member who has an higher or equal role hierarchy to yours!' });
		}

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const memberData = await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id });

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

		guildData.casesCount++;

		const caseInfo = {
			channel: message.channel.id,
			moderator: message.author.id,
			date: Date.now(),
			type: 'mute',
			case: guildData.casesCount,
			reason,
			time
		};

		memberData.mute.muted = true;
		memberData.mute.endDate = Date.now() + ms(time);
		memberData.mute.case = guildData.casesCount;
		memberData.sanctions.push(caseInfo);

		memberData.markModified('sanctions');
		memberData.markModified('mute');
		await memberData.save();

		await guildData.save();

		this.client.databaseCache.mutedUsers.set(`${member.id}${message.guild.id}`, memberData);

		if (guildData.plugins.moderations) {
			const sendChannel = message.guild.channels.cache.get(guildData.plugins.moderations);
			if (!sendChannel) return;

			const embed = new MessageEmbed()
				.setColor(Color.GREY)
				.setAuthor(`Moderation: Mute | Case #${guildData.casesCount}`, member.user.avatarURL({ dynamic: true }))
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
