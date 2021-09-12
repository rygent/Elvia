const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['conf', 'configuration'],
			description: 'Shows configuration on the server.',
			category: 'Administrator',
			memberPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD']
		});
	}

	async run(message, _args, data) {
		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor(`Configuration on ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
			.setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***Server prefix:*** \`${data.guild?.prefix}\``,
				`***Ignored channels:*** ${data.guild.ignoredChannels.length > 0 ? data.guild.ignoredChannels.map(ch => `<#${ch}>`).join(', ') : 'No ignored channels.'}`,
				`***Automatic role:*** ${data.guild.plugins.autorole.enabled ? `<@&${data.guild.plugins.autorole.role}>` : 'Disabled'}`,
				`***Automatic delete commands:*** ${data.guild.autoDeleteModCommands ? 'Enabled' : 'Disabled'}`
			].join('\n'))
			.addField('__Special channels__', [
				`***Moderations:*** ${data.guild.plugins.moderations ? `<#${data.guild.plugins.moderations}>` : 'Not defined.'}`,
				`***Messages:*** ${data.guild.plugins.messages ? `<#${data.guild.plugins.messages}>` : 'Not defined.'}`,
				`***Audits:*** ${data.guild.plugins.audits ? `<#${data.guild.plugins.audits}>` : 'Not defined.'}`,
				`***Suggestions:*** ${data.guild.plugins.suggestions ? `<#${data.guild.plugins.suggestions}>` : 'Not defined.'}`,
				`***Reports:*** ${data.guild.plugins.reports ? `<#${data.guild.plugins.reports}>` : 'Not defined.'}`
			].join('\n'))
			.addField('__Warning sanctions__', [
				`***Kick:*** ${data.guild.plugins.warnsSanctions.kick ? `After **${data.guild.plugins.warnsSanctions.kick}** warnings.` : 'Not defined.'}`,
				`***Ban:*** ${data.guild.plugins.warnsSanctions.ban ? `After **${data.guild.plugins.warnsSanctions.ban}** warnings.` : 'Not defined.'}`
			].join('\n'))
			.setFooter(`${message.author.username}  •  Powered by ${this.client.user.username}`, message.author.avatarURL({ dynamic: true }));

		return message.reply({ embeds: [embed] });
	}

};
