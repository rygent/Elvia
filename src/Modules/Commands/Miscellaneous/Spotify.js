const Command = require('../../../Structures/Command.js');
const { MessageButton, MessageEmbed } = require('discord.js');
const { Colors, Emojis } = require('../../../Structures/Configuration.js');
const { getData } = require('spotify-url-info');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Show detailed Spotify tracks the user is listening to.',
			category: 'Miscellaneous',
			usage: '(member)',
			cooldown: 3000
		});
	}
	/* eslint-disable consistent-return */
	async run(message, [target]) {
		const member = await this.client.resolveMember(target, message.guild) || message.member;
		if (member.presence === null || !member.presence.activities.find(spotify => spotify.name === 'Spotify')) {
			return message.reply(`**${member.displayName}** is not listening to Spotify!`);
		}

		getData(`https://open.spotify.com/track/${member.presence.activities.find(spotify => spotify.name === 'Spotify').syncId}`).then(async track => {
			const button = new MessageButton()
				.setStyle('LINK')
				.setLabel('Play on Spotify')
				.setEmoji(Emojis.SPOTIFY)
				.setURL(track.external_urls.spotify);

			const embed = new MessageEmbed()
				.setColor(Colors.SPOTIFY)
				.setAuthor('Listening on Spotify', 'https://i.imgur.com/9xO7toS.png', 'https://www.spotify.com/')
				.setTitle(track.name)
				.setURL(track.external_urls.spotify)
				.setImage(track.album.images[0].url)
				.setDescription([
					`***Artists:*** ${track.artists.map(artist => artist.name).join(', ')}`,
					`***Album:*** ${track.album.name}`,
					`***Tracks:*** ${track.track_number.formatNumber()} of ${track.album.total_tracks.formatNumber()}`,
					`***Released:*** ${moment(track.album.release_date).format('MMMM D, YYYY')}`,
					`***Duration:*** ${moment.duration(track.duration_ms).format('HH:mm:ss')}`,
					`***Listener:*** <@${member.user.id}>`
				].join('\n'))
				.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by Spotify`, message.author.avatarURL({ dynamic: true }));

			return message.reply({ embeds: [embed], components: [[button]] });
		});
	}

};
