const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'ping',
			aliases: ['pong'],
			description: 'Displays bot latency and API response times.',
			category: 'Information'
		});
	}

	async run(message) {
		const msg = await message.channel.send('Pinging...');
		const latency = Math.round(msg.createdTimestamp - message.createdTimestamp);
		const roleColor = message.guild.me.roles.highest.hexColor;

		if (latency <= 0) {
			const embed = new MessageEmbed()
				.setColor(roleColor === '#000000' ? Colors.CUSTOM : roleColor)
				.setDescription('Please try again later')
				.setFooter(`Responded in ${this.client.functions.responseTime(msg)}`, message.author.avatarURL({ dynamic: true }))
				.setTimestamp();

			return msg.edit('', embed);
		}

		const pingEmbed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.CUSTOM : roleColor)
			.setTitle('Bot Response Time')
			.setDescription(stripIndents`
				🤖 Bot Latency: \`${latency}ms\`
				🌐 API Latency: \`${Math.round(this.client.ws.ping)}ms\``)
			.setFooter(`Responded in ${this.client.functions.responseTime(msg)}`, message.author.avatarURL({ dynamic: true }))
			.setTimestamp();

		return msg.edit('', pingEmbed);
	}

};
