const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');

const chooseArr = ['🗻', '📰', '✂'];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'rps',
			aliases: [],
			description: 'Rock Paper Scissors game. React to one of the emojis to play the game.',
			category: 'fun',
			guildOnly: true,
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
		});
	}

	async run(message) {
		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.CUSTOM : roleColor)
			.setTitle('Rock Paper Scissors')
			.setDescription('Choose emojis to start the game!')
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		const msg = await message.channel.send(embed);
		const reacted = await this.client.functions.promptMessage(msg, message.author, 30, chooseArr);
		const botChoice = chooseArr.random();
		const result = await getResult(reacted, botChoice);
		await msg.reactions.removeAll();

		embed.setDescription('');
		embed.addField(result, `${reacted} vs ${botChoice}`);

		msg.edit(embed);

		function getResult(me, clientChosen) {
			if ((me === '🗻' && clientChosen === '✂') ||
                (me === '📰' && clientChosen === '🗻') ||
                (me === '✂' && clientChosen === '📰')) {
				return 'You won!';
			} else if (me === clientChosen) {
				return 'Its a tie!';
			} else {
				return 'You lost!';
			}
		}
	}

};
