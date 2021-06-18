const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
const answers = require('../../../../assets/json/8ball.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['8-ball', 'eightball', 'fortune'],
			description: 'Determine your destiny with the 8-ball.',
			category: 'Fun',
			usage: '[question]',
			cooldown: 3000
		});
	}

	async run(message, args) {
		if (!args[1]) {
			return message.quote('Please enter a question to determine your destiny!');
		}

		const RatingArray = ['Low', 'Medium', 'High'];
		const Choice = answers[Math.floor(Math.random() * answers.length).toString(10)];

		const embed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setTitle(`🎱 ${args.slice(0).join(' ')}`)
			.setDescription(`❯  ${Choice.Message}`)
			.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Rate: ${RatingArray[Choice.Rating]}`, message.author.avatarURL({ dynamic: true }));

		return message.channel.send(embed);
	}

};
