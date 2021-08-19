const Interaction = require('../../Structures/Interaction.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Configuration.js');
const moment = require('moment');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'user',
			description: 'User information',
			options: [{
				type: 'SUB_COMMAND',
				name: 'info',
				description: 'Gets user information',
				options: [{
					type: 'USER',
					name: 'user',
					description: 'User to fetch information'
				}]
			}]
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user') || interaction.member;
		const roles = member.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);

		const status = {
			online: `Online`,
			idle: `Idle`,
			dnd: `Do Not Disturb`,
			offline: `Offline`
		};

		const userFlags = member.user.flags.toArray();

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor(`User Information for ${member.user.username}`, member.user.avatarURL({ dynamic: true }))
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***Username:*** ${member.user.tag}`,
				`***ID:*** \`${member.id}\``,
				`***Nickname:*** ${member.displayName}`,
				`***Flags:*** ${userFlags.length ? userFlags.map(flag => this.client.utils.formatPerms(flag)).join(', ') : 'None'}`,
				`***Status:*** ${member.presence !== null ? status[member.presence.status] : status.offline}`,
				`***Activity:*** ${member.presence !== null && member.presence.activities.length > 0 ? member.presence.activities.join(', ') : 'No Activity'}`,
				`***Registered:*** ${moment(member.user.createdTimestamp).format('MMMM D, YYYY HH:mm')} (${moment(member.user.createdTimestamp).fromNow()})`
			].join('\n'))
			.addField(`__Member__`, [
				`***Joined:*** ${moment(member.joinedAt).format('MMMM D, YYYY HH:mm')} (${moment(member.joinedAt).fromNow()})`,
				`***Highest Role:*** ${member.roles.highest.id === interaction.guild.id ? 'None' : member.roles.highest.name}`,
				`***Hoist Role:*** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
				`***Roles (${roles.length}):*** ${roles.length < 10 ? roles.join(' ') : roles.length > 10 ? this.client.utils.trimArray(roles).join(', ') : 'None'}`
			].join('\n'))
			.setFooter(`Powered by ${this.client.user.username}`, interaction.user.avatarURL({ dynamic: true }));

		return interaction.reply({ embeds: [embed] });
	}

};
