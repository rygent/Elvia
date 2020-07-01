const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const eightBall = require('../../../../assets/json/8ball.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: '8ball',
			aliases: ['8-ball', 'eightball', 'fortune'],
			description: 'Returns an answer to any question!',
			category: 'fun',
			usage: '<question>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
		});
	}

	async run(message, args) {
		if (!args[1]) {
			message.channel.send('Please provide a question for me to answer.');
			return;
		}

		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setTitle(`🎱 ${args.slice(0).join(' ')}`)
			.setDescription(`❯  ${eightBall[Math.floor(Math.random() * eightBall.length).toString(10)]}`)
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	}

};
