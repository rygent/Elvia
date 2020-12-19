const Event = require('../../../Structures/Event.js');
const ElainaEmbed = require('../../../Structures/ElainaEmbed.js');
const { Colors } = require('../../../Structures/Configuration.js');
const { Util: { escapeMarkdown } } = require('discord.js');
const { diffWordsWithSpace } = require('diff');

module.exports = class extends Event {

	async run(old, message) {
		if (!message.guild || old.content === message.content || message.author.bot) return;

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });

		if (guildData.plugins.audits) {
			const sendChannel = message.guild.channels.cache.get(guildData.plugins.audits);
			if (!sendChannel) return;

			const roleColor = message.guild.me.roles.highest.hexColor;

			const embed = new ElainaEmbed()
				.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
				.setTitle('Message Edited')
				.setDescription([
					`***Message ID:*** \`${old.id}\``,
					`***Channel:*** ${old.channel}`,
					`***Author:*** ${old.author.tag} (\`${old.author.id}\`)`
				].join('\n'))
				.setURL(old.url)
				.splitFields(diffWordsWithSpace(escapeMarkdown(old.content), escapeMarkdown(message.content))
					.map(result => result.added ? `**${result.value}**` : result.removed ? `~~${result.value}~~` : result.value)
					.join(' '))
				.setFooter(`Powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

			if (sendChannel) sendChannel.send(embed);
		}
	}

};
