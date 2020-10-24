const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pong'],
			description: 'Displays bot latency and API response times.',
			category: 'utility',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 3000
		});
	}

	async run(message) {
		const msg = await message.channel.send('Pinging...');
		const latency = Math.round(msg.createdTimestamp - message.createdTimestamp);

		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setDescription(stripIndents`
				💓 ***Heartbeat:*** \`${Math.round(this.client.ws.ping).formatNumber()}ms\`
				⏱️ ***Latency:*** \`${latency.formatNumber()}ms\`
			`)
			.setFooter(`Responded in ${this.client.utils.responseTime(msg)}`, message.author.avatarURL({ dynamic: true }));

		if (latency <= 0) {
			embed.setDescription('Please try again later');
		}

		msg.edit('\u200B', embed);
	}

};
