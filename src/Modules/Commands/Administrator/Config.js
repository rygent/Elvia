const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['conf', 'configuration'],
			description: 'Shows configuration on the server.',
			category: 'Administrator',
			userPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD'],
			cooldown: 3000
		});
	}

	async run(message) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });

		const embed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setAuthor(`Configuration on ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
			.setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***Server prefix:*** \`${guildData.prefix}\``,
				`***Ignored channels:*** ${guildData.ignoredChannels.length > 0 ? guildData.ignoredChannels.map((ch) => `<#${ch}>`).join(', ') : 'No ignored channels.'}`,
				`***Automatic role:*** ${guildData.plugins.autorole.enabled ? `<@&${guildData.plugins.autorole.role}>` : 'Disabled'}`,
				`***Automatic delete commands:*** ${guildData.autoDeleteModCommands ? 'Enabled' : 'Disabled'}`
			].join('\n'))
			.addField('__Special channels__', [
				`***Moderations:*** ${guildData.plugins.moderations ? `<#${guildData.plugins.moderations}>` : 'Not defined.'}`,
				`***Messages:*** ${guildData.plugins.audits ? `<#${guildData.plugins.audits}>` : 'Not defined.'}`,
				`***Suggestions:*** ${guildData.plugins.suggestions ? `<#${guildData.plugins.suggestions}>` : 'Not defined.'}`,
				`***Reports:*** ${guildData.plugins.reports ? `<#${guildData.plugins.reports}>` : 'Not defined.'}`
			].join('\n'))
			.addField('__Warning sanctions__', [
				`***Kick:*** ${guildData.plugins.warnsSanctions.kick ? `After **${guildData.plugins.warnsSanctions.kick}** warnings.` : 'Not defined.'}`,
				`***Ban:*** ${guildData.plugins.warnsSanctions.ban ? `After **${guildData.plugins.warnsSanctions.ban}** warnings.` : 'Not defined.'}`
			].join('\n'))
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		return message.channel.send({ embeds: [embed] });
	}

};
