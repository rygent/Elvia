const InteractionCommand = require('../../../../Structures/Interaction');
const { EmbedBuilder } = require('@discordjs/builders');
const { Formatters } = require('discord.js');
const { Badges, Colors, Emojis } = require('../../../../Utils/Constants');

module.exports = class extends InteractionCommand {

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
		const userBadges = member.user.flags.toArray();

		const roles = member.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);
		const permissions = member.permissions.toArray().filter(perm => !interaction.guild.roles.everyone.permissions.toArray().includes(perm));

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() })
			.setThumbnail(member.user.displayAvatarURL({ size: 512 }))
			.setDescription([
				`***ID:*** \`${member.id}\``,
				`***Nickname:*** ${member.nickname || '`N/A`'}`,
				`***Badges:*** ${userBadges.length ? userBadges.map(item => Badges[item]).join(' ') : '`N/A`'}`,
				`***Status:*** ${status[member.presence?.status] || status.offline}`,
				`***Created:*** ${Formatters.time(new Date(member.user.createdTimestamp), 'D')} (${Formatters.time(new Date(member.user.createdTimestamp), 'R')})`,
				`***Joined:*** ${Formatters.time(new Date(member.joinedAt), 'D')} (${Formatters.time(new Date(member.joinedAt), 'R')})`
			].join('\n'))
			.addFields({ name: `__Roles__ (${roles.length ? roles.length : 1})`, value: `${roles.length ? roles.join(', ') : `@everyone`}`, inline: false })
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		if (permissions.length) {
			embed.addFields({ name: '__Permission(s)__', value: `${this.client.utils.formatArray(permissions.map(perm => this.client.utils.formatPermissions(perm)))}`, inline: false });
		}

		return interaction.reply({ embeds: [embed] });
	}

};
