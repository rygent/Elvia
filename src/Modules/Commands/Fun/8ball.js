const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
const answers = require('../../../../assets/json/8ball.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['8-ball', 'eightball', 'fortune'],
			description: 'A command decides your fate with an 8-ball, obviously 8-balls aren\'t real you dingus.',
			category: 'Fun',
			usage: '<question>',
			cooldown: 3000
		});
	}

	async run(message, args) {
		if (!args[1]) {
			return message.quote('Provide a question for the 8-ball.');
		}

		const RatingArray = ['Low', 'Medium', 'High'];
		const Choice = answers[Math.floor(Math.random() * answers.length).toString(10)];

		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setTitle(`🎱 ${args.slice(0).join(' ')}`)
			.setDescription(`❯  ${Choice.Message}`)
			.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Rate: ${RatingArray[Choice.Rating]}`, message.author.avatarURL({ dynamic: true }));

		return message.channel.send(embed);
	}

};
