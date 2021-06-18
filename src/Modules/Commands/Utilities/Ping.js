const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pong'],
			description: 'Shows Bot latency & API response time.',
			category: 'Utilities',
			cooldown: 1000
		});
	}

	async run(message) {
		const msg = await message.channel.send('Pinging...');
		const latency = Math.round(msg.createdTimestamp - message.createdTimestamp);

		const embed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setDescription([
				`💓 ***Heartbeat:*** \`${Math.round(this.client.ws.ping)}ms\``,
				`⏱️ ***Latency:*** \`${latency}ms\``
			].join('\n'))
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		if (latency <= 0) {
			embed.setDescription('Please try again later');
		}

		msg.edit({ content: '\u200B', embeds: [embed] });
	}

};
