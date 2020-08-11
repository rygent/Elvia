const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['qr'],
			description: 'Generates a QR Code with your text!',
			category: 'miscellaneous',
			usage: '<text>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [...text]) {
		if (!text) return message.channel.send('You must enter a text!');

		const msg = await message.channel.send('Generating...');
		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text.join(' ').replace(new RegExp(' ', 'g'), '%20')}`)
			.setFooter(`Responded in ${this.client.functions.responseTime(msg)}`, message.author.avatarURL({ dynamic: true }));

		msg.edit('\u200B', embed);
	}

};
