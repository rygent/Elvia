const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['conf', 'configuration'],
			description: 'Shows the server configuration!',
			category: 'Administrator',
			userPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD'],
			cooldown: 3000
		});
	}

	async run(message) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setAuthor(`Configuration of ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
			.setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true, size: 4096 }))
			.setDescription([
				`***Server prefix:*** \`${guildData.prefix}\``,
				`***Ignored channels:*** ${guildData.ignoredChannels.length > 0 ? guildData.ignoredChannels.map((ch) => `<#${ch}>`).join(', ') : 'No ignored channels.'}`,
				`***Autorole:*** ${guildData.plugins.autorole.enabled ? `<@&${guildData.plugins.autorole.role}>` : 'Autorole disabled.'}`,
				`***Automatic delete moderation commands:*** ${guildData.autoDeleteModCommands ? 'Enabled' : 'Disabled'}`
			].join('\n'))
			.addField('Special channels', [
				`***Moderations:*** ${guildData.plugins.moderations ? `<#${guildData.plugins.moderations}>` : 'Not defined.'}`,
				`***Audits:*** ${guildData.plugins.audits ? `<#${guildData.plugins.audits}>` : 'Not defined.'}`,
				`***Suggestions:*** ${guildData.plugins.suggestions ? `<#${guildData.plugins.suggestions}>` : 'Not defined.'}`,
				`***Reports:*** ${guildData.plugins.reports ? `<#${guildData.plugins.reports}>` : 'Not defined.'}`
			].join('\n'))
			.addField('Automatic sanctions', [
				`***Kick:*** ${guildData.plugins.warnsSanctions.kick ? `After **${guildData.plugins.warnsSanctions.kick}** warnings.` : 'Not defined.'}`,
				`***Ban:*** ${guildData.plugins.warnsSanctions.ban ? `After **${guildData.plugins.warnsSanctions.ban}** warnings.` : 'Not defined.'}`
			].join('\n'))
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		return message.channel.send(embed);
	}

};
