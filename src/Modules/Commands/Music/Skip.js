const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['next'],
			description: 'Skip the current song',
			category: 'Music',
			cooldown: 5000
		});
	}

	/* eslint-disable consistent-return */
	async run(message) {
		const queue = await this.client.player.getQueue(message);

		const voice = message.member.voice.channel;
		if (!voice) return message.quote('You must be connected to a voice channel!');

		if (!queue) return message.quote('No songs are currently playing in this server.');
		if (!queue.tracks[0]) return message.quote('There\'s no song after this one!');

		const members = voice.members.filter((member) => !member.user.bot);
		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setAuthor('Skip the current song')
			.setThumbnail(queue.tracks[0].thumbnail)
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		const msg = await message.channel.send(embed);

		if (members.size > 1) {
			msg.react('👍');

			// eslint-disable-next-line no-mixed-operators
			const mustVote = Math.floor(members.size / 2 + 1);

			embed.setDescription(`Next song: ${queue.tracks[0].name}\nReact with 👍 to stop the music! ${mustVote} more votes are required.`);
			msg.edit(embed);

			const filter = (reaction, user) => {
				const member = message.guild.members.cache.get(user.id);
				const voiceChannel = member.voice.channel;
				if (voiceChannel) {
					return voiceChannel.id === voice.id;
				}
			};

			const collector = await msg.createReactionCollector(filter, {
				time: 25000
			});

			collector.on('collect', (reaction) => {
				const haveVoted = reaction.count - 1;
				if (haveVoted >= mustVote) {
					this.client.player.skip(message);
					embed.setDescription('Song skipped!');
					msg.edit(embed);
					collector.stop(true);
				} else {
					embed.setDescription(`Next song: ${queue.tracks[0].name}\nReact with 👍 to stop the music! ${mustVote} more votes are required.`);
					msg.edit(embed);
				}
			});

			collector.on('end', (collected, isDone) => {
				if (!isDone) {
					return message.quote('Time\'s up! Please send the command again!');
				}
			});
		} else {
			this.client.player.skip(message);
			embed.setDescription('Song skipped!');
			msg.edit(embed);
		}
	}

};
