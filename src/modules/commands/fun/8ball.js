const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const eightBall = require('../../../../assets/json/8ball.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['8-ball', 'eightball', 'fortune'],
			description: 'A command decides your fate with an 8-ball, obviously 8-balls aren\'t real you dingus.',
			category: 'fun',
			usage: '<your question>',
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, args) {
		if (!args[1]) {
			return this.client.embeds.common('commonError', message, 'Provide a question for the 8-ball.');
		}

		const RatingArray = ['Low', 'Medium', 'High'];
		const Choice = eightBall[Math.floor(Math.random() * eightBall.length).toString(10)];

		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setTitle(`🎱 ${args.slice(0).join(' ')}`)
			.setDescription(`❯  ${Choice.Message}`)
			.setFooter(`Rate: ${RatingArray[Choice.Rating]} | Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	}

};
