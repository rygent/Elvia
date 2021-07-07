const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors, Emojis } = require('../../../Structures/Configuration.js');
const flags = require('../../../../assets/json/UserFlags.json');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['uinfo', 'userinfo', 'whois'],
			description: 'Displays information about the mentioned user.',
			category: 'Utilities',
			usage: '(member)',
			cooldown: 3000
		});
	}

	async run(message, [target]) {
		const member = await this.client.resolveMember(target, message.guild) || message.member;
		const roles = member.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);

		const status = {
			online: `${Emojis.ONLINE} Online`,
			idle: `${Emojis.IDLE} Idle`,
			dnd: `${Emojis.DND} Do Not Disturb`,
			offline: `${Emojis.OFFLINE} Offline`
		};

		const userFlags = member.user.flags.toArray();

		const embed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setAuthor(`User Information for ${member.user.username}`, member.user.avatarURL({ dynamic: true }))
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***Username:*** ${member.user.tag} ${member.user.bot ? Emojis.BOT : ''}`,
				`***ID:*** \`${member.id}\``,
				`***Nickname:*** ${member.displayName}`,
				`***Flags:*** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(' ') : 'None.'}`,
				`***Status:*** ${member.presence !== null ? status[member.presence.status] : status.offline}`,
				`***Activity:*** ${member.presence !== null && member.presence.activities.length > 0 ? member.presence.activities.join(', ') : 'No Activity'}`,
				`***Created at:*** ${moment(member.user.createdTimestamp).format('MMMM D, YYYY HH:mm')} (${moment(member.user.createdTimestamp).fromNow()})`
			].join('\n'))
			.addField(`__Member__`, [
				`***Joined at:*** ${moment(member.joinedAt).format('MMMM D, YYYY HH:mm')} (${moment(member.joinedAt).fromNow()})`,
				`***Highest Role:*** ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
				`***Hoist Role:*** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
				`***Roles (${roles.length}):*** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles).join(', ') : 'None'}`
			].join('\n'))
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		return message.reply({ embeds: [embed] });
	}

};
