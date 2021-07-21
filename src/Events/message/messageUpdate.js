const Event = require('../../Structures/Event.js');
const ClientEmbed = require('../../Structures/ClientEmbed.js');
const { Color } = require('../../Utils/Configuration.js');
const { Util: { escapeMarkdown } } = require('discord.js');
const { diffWordsWithSpace } = require('diff');

module.exports = class extends Event {

	async run(old, message) {
		if (!message.guild || old.content === message.content || message.author.bot) return;

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });

		if (guildData.plugins.audits) {
			const sendChannel = message.guild.channels.cache.get(guildData.plugins.audits);
			if (!sendChannel) return;

			const embed = new ClientEmbed()
				.setColor(Color.DEFAULT)
				.setTitle('Message Edited')
				.setThumbnail(old.author.displayAvatarURL({ dynamic: true, size: 512 }))
				.setDescription([
					`***Message ID:*** \`${old.id}\``,
					`***Channel:*** ${old.channel}`,
					`***Author:*** <@${old.author.id}>`
				].join('\n'))
				.setURL(old.url)
				.splitFields(diffWordsWithSpace(escapeMarkdown(old.content), escapeMarkdown(message.content))
					.map(result => result.added ? `**${result.value}**` : result.removed ? `~~${result.value}~~` : result.value)
					.join(' '))
				.setFooter(`Powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

			if (sendChannel) sendChannel.send({ embeds: [embed] });
		}
	}

};
