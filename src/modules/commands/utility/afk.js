const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Become an AFK (members who mention you will receive a message).',
			category: 'utility',
			clientPerms: ['SEND_MESSAGES'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, args, data) {
		const reason = args.join(' ');
		if (!reason) return message.channel.send('Please specify the reason for your afk!');

		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setDescription(`You're going AFK!\nReason: ${reason}`)
			.setFooter(`AFK system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

		message.channel.send(embed);

		data.userData.afk = reason;
		data.userData.save();
	}

};
