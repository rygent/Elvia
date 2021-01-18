const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Resume the current song!',
			category: 'Music',
			cooldown: 5000
		});
	}

	async run(message) {
		const queue = this.client.player.getQueue(message);

		const voice = message.member.voice.channel;
		if (!voice) return message.quote('You must be connected to a voice channel!');

		if (!queue) return message.quote('No songs are currently playing in this server.');

		await this.client.player.pause(message);

		return message.quote('⏸️ Music paused.');
	}

};
