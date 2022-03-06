const Interaction = require('../../../../Structures/Interaction');
const { Formatters, MessageEmbed } = require('discord.js');
const { Colors, Emojis } = require('../../../../Utils/Constants');
const flags = require('../../../../Assets/json/Badge.json');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'userinfo',
			description: 'Get user information.'
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user') || interaction.member;

		const status = {
			online: `${Emojis.Online} Online`,
			idle: `${Emojis.Idle} Idle`,
			dnd: `${Emojis.Dnd} Do Not Disturb`,
			offline: `${Emojis.Offline} Offline`
		};
		const userFlags = member.user.flags.toArray();

		const roles = member.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);
		const permissions = member.permissions.toArray().filter(x => !interaction.guild.roles.everyone.permissions.toArray().includes(x));

		const embed = new MessageEmbed()
			.setColor(Colors.Default)
			.setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true }) })
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***ID:*** \`${member.id}\``,
				`***Nickname:*** ${member.nickname || '`N/A`'}`,
				`***Flags:*** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(' ') : '`N/A`'}`,
				`***Status:*** ${status[member.presence?.status] || status.offline}`,
				`***Created:*** ${Formatters.time(new Date(member.user.createdTimestamp), 'D')} (${Formatters.time(new Date(member.user.createdTimestamp), 'R')})`,
				`***Joined:*** ${Formatters.time(new Date(member.joinedAt), 'D')} (${Formatters.time(new Date(member.joinedAt), 'R')})`
			].join('\n'))
			.addField(`__Roles__ (${roles.length > 0 ? roles.length : '1'})`, `${roles.length > 0 ? this.client.utils.formatArray(roles) : `@everyone`}`)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

		if (permissions.length > 0) {
			embed.addField('__Permission(s)__', `${this.client.utils.formatArray(permissions.map(x => this.client.utils.formatPermissions(x)))}`);
		}

		return interaction.reply({ embeds: [embed] });
	}

};
