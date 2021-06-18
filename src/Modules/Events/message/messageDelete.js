const Event = require('../../../Structures/Event.js');
const ClientEmbed = require('../../../Structures/ClientEmbed.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Event {

	async run(message) {
		if (!message.guild || message.author.bot) return;

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });

		if (guildData.plugins.audits) {
			const sendChannel = message.guild.channels.cache.get(guildData.plugins.audits);
			if (!sendChannel) return;

			const attachments = message.attachments.size ? message.attachments.map(attachment => attachment.proxyURL) : null;

			const embed = new ClientEmbed()
				.setColor(Colors.DEFAULT)
				.setTitle('Message Delete')
				.setThumbnail(message.member.user.displayAvatarURL({ dynamic: true, size: 512 }))
				.setDescription([
					`***Message ID:*** \`${message.id}\``,
					`***Channel:*** ${message.channel}`,
					`***Author:*** <@${message.member.id}>`,
					`${attachments ? `***Attachments:*** ${attachments.join('\n')}` : ''}`
				].join('\n'))
				.setFooter(`Powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));
			if (message.content.length) {
				embed.splitFields(`***Deleted Message:*** ${message.content}`);
			}

			if (sendChannel) sendChannel.send(embed);
		}
	}

};
