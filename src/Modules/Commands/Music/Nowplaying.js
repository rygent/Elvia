const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['np', 'now-playing'],
			description: 'Shows information about the current song!',
			category: 'Music',
			cooldown: 5000
		});
	}

	async run(message) {
		const queue = this.client.player.getQueue(message);

		const voice = message.member.voice.channel;
		if (!voice) return message.quote('You must be connected to a voice channel!');

		if (!queue) return message.quote('No songs are currently playing in this server.');

		const track = await this.client.player.nowPlaying(message);
		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setTitle('Currently playing')
			.setThumbnail(track.thumbnail)
			.setDescription([
				`***Title:*** ${track.title}`,
				`***Channel:*** ${track.author}`,
				`***Duration:*** ${moment.duration(track.durationMS).format('d [Days] h [Hours] m [Minutes] s [Seconds]')}`,
				`***Description:*** ${track.description ? `${track.description.substring(0, 150)}\nand more...` : 'No description...'}`
			].join('\n'))
			.addField('\u200B', this.client.player.createProgressBar(message, { timecodes: true }))
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		return message.channel.send(embed);
	}

};
