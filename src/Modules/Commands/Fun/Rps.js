const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

const chooseArr = ['👊', '🖐', '✌'];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Play rock paper scissors game by choosing emoji reactions.',
			category: 'Fun',
			cooldown: 5000
		});
	}

	async run(message) {
		const embed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setDescription('Choose emojis to start the game!')
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		const msg = await message.reply({ embeds: [embed] });
		const reacted = await this.promptMessage(msg, message.author, 30, chooseArr);
		const botChoice = chooseArr.random();
		const result = await getResult(reacted, botChoice);
		await msg.reactions.removeAll();

		embed.setDescription(`${reacted} vs ${botChoice} (${result})`);

		msg.edit({ embeds: [embed] });

		function getResult(me, clientChosen) {
			if ((me === '👊' && clientChosen === '✌') ||
                (me === '🖐' && clientChosen === '👊') ||
                (me === '✌' && clientChosen === '🖐')) {
				return 'You win';
			} else if (me === clientChosen) {
				return 'It\'s a draw';
			} else {
				return 'You lose';
			}
		}
	}

	async promptMessage(message, author, time, validReactions) {
		time *= 1000;

		for (const reaction of validReactions) await message.react(reaction);

		const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

		return message
			.awaitReactions(filter, { max: 1, time: time })
			.then(collected => collected.first() && collected.first().emoji.name);
	}

};
