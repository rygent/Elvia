const Command = require('../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Plays music!',
			category: 'Music',
			usage: '<song>',
			clientPerms: ['CONNECT', 'SPEAK'],
			cooldown: 3000
		});
	}

	async run(message, args) {
		if (!message.member.voice.channel) return message.reply({ content: 'You need to join a voice channel.' });
		if (!args.length) return message.reply({ content: 'You need to give me a URL or a search term.' });

		const search = args.join(' ').trim();
		let res;

		try {
			res = await this.client.manager.search(search, message.author);
			if (res.loadType === 'LOAD_FAILED') throw res.exception;
			else if (res.loadType === 'PLAYLIST_LOADED') throw { message: 'Playlists are not supported with this command.' };
		} catch (err) {
			return message.reply({ content: `There was an error while searching: ${err.message}` });
		}

		if (res.loadType === 'NO_MATCHES') return message.reply({ content: 'There was no tracks found with that query.' });

		const player = this.client.manager.create({
			guild: message.guild.id,
			voiceChannel: message.member.voice.channel.id,
			textChannel: message.channel.id,
			selfDeafen: true
		});

		player.connect();
		player.queue.add(res.tracks[0]);

		if (!player.playing && !player.paused && !player.queue.size) player.play();

		return message.reply({ content: `Enqueuing ${res.tracks[0].title}.` });
	}

};
