const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Plays music for you!',
			category: 'Music',
			usage: '<song>',
			cooldown: 5000
		});
	}

	/* eslint-disable-next-line consistent-return */
	async run(message, args) {
		const song = args.join(' ').trim();
		if (!song) return message.quote('Please specify a song name or a link!');

		const voice = message.member.voice.channel;
		if (!voice) return message.quote('You must be connected to a voice channel!');

		const perms = voice.permissionsFor(this.client.user);
		if (!perms.has('CONNECT') || !perms.has('SPEAK')) {
			return message.quote('I can\'t connect to your voice channel!');
		}

		await this.client.player.play(message, song);
	}

};
