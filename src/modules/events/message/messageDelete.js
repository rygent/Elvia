const Event = require('../../../structures/Event.js');
const CustomEmbed = require('../../../structures/Embeds.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Event {

	async run(message) {
		if (!message.guild || message.author.bot) return;

		const data = await this.client.findOrCreateGuild({ id: message.guild.id });
		if (data.plugins.msglogs) {
			const sendChannel = message.guild.channels.cache.get(data.plugins.msglogs);
			if (!sendChannel) return;

			const roleColor = message.guild.me.roles.highest.hexColor;

			const attachments = message.attachments.size ? message.attachments.map(attachment => attachment.proxyURL) : null;
			const embed = new CustomEmbed()
				.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
				.setTitle('Message Delete')
				.setDescription(stripIndents`
                    ***Message ID:*** \`${message.id}\`
                    ***Channel:*** ${message.channel}
                    ***Author:*** ${message.member.displayName}
                    ${attachments ? `***Attachments:*** ${attachments.join('\n')}` : ''}    
				`)
				.setFooter(`Powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));
			if (message.content.length) {
				embed.splitFields(`***Deleted Message:*** ${message.content}`);
			}

			if (sendChannel) sendChannel.send(embed);
		}
	}

};
