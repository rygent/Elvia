const Event = require('../../../Structures/Event.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Event {

	async run(message, queue, tracks) {
		if (tracks.length > 20) tracks = tracks.slice(0, 20);

		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setDescription(tracks.map((track, i) => `**${++i} -** ${track.title}`).join('\n'))
			.setFooter('Please select a song by sending a number between 1 and 10.');
		return message.channel.send(embed);
	}

};
