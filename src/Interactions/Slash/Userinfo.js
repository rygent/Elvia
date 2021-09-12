const Interaction = require('../../Structures/Interaction.js');
const { Formatters, MessageEmbed } = require('discord.js');
const { Color, Emoji } = require('../../Utils/Setting.js');
const flags = require('../../../assets/json/Badge.json');
const moment = require('moment');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'userinfo',
			description: 'Gets user information',
			options: [
				{ type: 'USER', name: 'user', description: 'User to fetch information' }
			]
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user') || interaction.member;
		const roles = member.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);

		const status = {
			online: `${Emoji.ONLINE} Online`,
			idle: `${Emoji.IDLE} Idle`,
			dnd: `${Emoji.DND} Do Not Disturb`,
			offline: `${Emoji.OFFLINE} Offline`
		};

		const userFlags = member.user.flags.toArray();

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***Username:*** ${member.user.username} ${member.user.bot ? Emoji.BOT : ''}`,
				`***ID:*** \`${member.id}\``,
				`***Nickname:*** ${member.nickname || 'None'}`,
				`***Flags:*** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(' ') : 'None'}`,
				`***Status:*** ${status[member.presence?.status] || status.offline}`,
				`***Activity:*** ${member.presence?.activities.join(', ') || 'No Activity'}`,
				`***Registered:*** ${Formatters.time(new Date(member.user.createdTimestamp))} (${moment(member.user.createdTimestamp).fromNow()})`
			].join('\n'))
			.addField(`__Member__`, [
				`***Joined:*** ${Formatters.time(new Date(member.joinedAt))} (${moment(member.joinedAt).fromNow()})`,
				`***Highest Role:*** ${member.roles.highest.id === interaction.guild.id ? 'None' : member.roles.highest.name}`,
				`***Hoist Role:*** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
				`***Roles (${roles.length}):*** ${roles.length < 10 ? roles.join(' ') : roles.length > 10 ? this.client.utils.trimArray(roles).join(', ') : 'None'}`
			].join('\n'))
			.setFooter(`${interaction.user.username}  •  Powered by ${this.client.user.username}`, interaction.user.avatarURL({ dynamic: true }));

		return interaction.reply({ embeds: [embed] });
	}

};
