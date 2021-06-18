const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Gives you a bot invite link.',
			category: 'Utilities',
			cooldown: 3000
		});
	}

	async run(message) {
		const embed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setTitle('Click here to add me to your server!')
			.setURL(`https://discordapp.com/oauth2/authorize?&client_id=${this.client.user.id}&scope=bot&permissions=1584786551`)
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		return message.channel.send(embed);
	}

};
