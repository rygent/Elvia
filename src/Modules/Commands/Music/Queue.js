const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
const { FieldsEmbed } = require('discord-paginationembed');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Shows the server queue',
			category: 'Music',
			cooldown: 5000
		});
	}

	/* eslint-disable consistent-return */
	async run(message) {
		const voice = message.member.voice.channel;
		if (!voice) return message.quote('You must be connected to a voice channel!');

		const queue = this.client.player.getQueue(message);
		if (!queue) return message.quote('No songs are currently playing in this server.');

		const roleColor = message.guild.me.roles.highest.hexColor;

		if (queue.tracks.length === 1) {
			const embed = new MessageEmbed()
				.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
				.setAuthor('Server Queue', message.guild.iconURL({ dynamic: true }))
				.addField('Currently playing', [
					`[${queue.tracks[0].title}](${queue.tracks[0].url})\n`,
					`*Requested by ${queue.tracks[0].requestedBy}*`
				].join('\n'))
				.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

			return message.channel.send(embed);
		}
		let i = 0;

		const fieldsEmbed = new FieldsEmbed();

		fieldsEmbed.embed
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setAuthor('Server Queue', message.guild.iconURL({ dynamic: true }))
			.addField('Currently playing', [
				`[${queue.tracks[0].title}](${queue.tracks[0].url})\n`,
				`*Requested by ${queue.tracks[0].requestedBy}*`
			].join('\n'));

		fieldsEmbed.setArray(queue.tracks[1] ? queue.tracks.slice(1, queue.tracks.length) : [])
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setElementsPerPage(5)
			.setPageIndicator(true)
			.formatField('Queue', (track) => [
				`${++i}. [${track.title}](${track.url})`,
				`\n*Requested by ${track.requestedBy}*`
			].join('\n'));

		fieldsEmbed.build();
	}

};
