const Event = require('../../../structures/Event.js');
const CustomEmbed = require('../../../structures/Embeds.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const { Util: { escapeMarkdown } } = require('discord.js');
const { diffWordsWithSpace } = require('diff');


module.exports = class extends Event {

	async run(old, message) {
		if (!message.guild || old.content === message.content || message.author.bot) return;

		const data = await this.client.findOrCreateGuild({ id: message.guild.id });
		if (data.plugins.msglogs) {
			const sendChannel = message.guild.channels.cache.get(data.plugins.msglogs);
			if (!sendChannel) return;

			const roleColor = message.guild.me.roles.highest.hexColor;

			const embed = new CustomEmbed()
				.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
				.setTitle('Message Edited')
				.setDescription(stripIndents`
					***Message ID:*** \`${old.id}\`
					***Channel:*** ${old.channel}
					***Author:*** ${old.author.tag} (\`${old.author.id}\`)	
				`)
				.setURL(old.url)
				.splitFields(diffWordsWithSpace(escapeMarkdown(old.content), escapeMarkdown(message.content))
					.map(result => result.added ? `**${result.value}**` : result.removed ? `~~${result.value}~~` : result.value)
					.join(' '))
				.setFooter(`Powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

			if (sendChannel) sendChannel.send(embed);
		}
	}

};
