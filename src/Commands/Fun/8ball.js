const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');
const Answer = require('../../../assets/json/8ball.json');

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
			return message.reply({ content: 'Please enter a question to determine your destiny!' });
		}

		const RatingArray = ['Low', 'Medium', 'High'];
		const Choice = Answer[Math.floor(Math.random() * Answer.length).toString(10)];

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setTitle(`🎱 ${args.slice(0).join(' ')}`)
			.setDescription([
				`❯  ${Choice.Message}\n`,
				`***Rate:*** ${RatingArray[Choice.Rating]}`
			].join('\n'))
			.setFooter(`${message.author.username}  •  Powered by ${this.client.user.username}`, message.author.avatarURL({ dynamic: true }));

		return message.reply({ embeds: [embed] });
	}

};
