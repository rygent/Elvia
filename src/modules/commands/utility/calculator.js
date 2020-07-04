const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const math = require('mathjs');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['calc', 'math', 'solve'],
			description: 'Calculates for you an calculation',
			category: 'utility',
			usage: '<equation>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [equation]) {
		if (!equation) return message.channel.send('You have to specify what you would like to count on!');

		try {
			const answer = math.evaluate(equation);

			const roleColor = message.guild.me.roles.highest.hexColor;
			const embed = new MessageEmbed()
				.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
				.setTitle('Math Calculation')
				.setDescription(stripIndents`
                    ***Calculation:*** \`${equation}\`
                    ***Result:*** \`${answer}\``)
				.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

			message.channel.send(embed);
		} catch {
			return message.channel.send('Invalid mathematical calculation!');
		}
	}

};
