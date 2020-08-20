const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Gives you the bot invite link!',
			category: 'utility',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	async run(message) {
		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setTitle('Click Here to add me to your Server!')
			.setURL(`https://discordapp.com/oauth2/authorize?&client_id=${this.client.user.id}&scope=bot&permissions=1584786551`)
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	}

};
