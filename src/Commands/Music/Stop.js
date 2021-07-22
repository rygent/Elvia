const Command = require('../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Stops the currently playing music and leaves the voice channel.',
			category: 'Music',
			clientPerms: ['CONNECT', 'SPEAK'],
			cooldown: 3000
		});
	}

	async run(message) {
		const player = this.client.manager.players.get(message.guild.id);
		if (!player) {
			return message.reply({ content: 'No song is being currently played in this server.' });
		}

		if (!message.member.voice.channel) {
			return message.reply({ content: 'You need to join a voice channel.' });
		} else if (message.member.voice.channel.id !== player.voiceChannel) {
			return message.reply({ content: 'You\'re not in the same voice channel.' });
		}

		player.destroy();
		return message.reply({ content: 'Music has been stopped.' });
	}

};
