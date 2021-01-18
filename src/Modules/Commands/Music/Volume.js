const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vol'],
			description: 'Set the volume between 1 to 100',
			category: 'Music',
			usage: '[number]',
			cooldown: 5000
		});
	}

	async run(message, [number]) {
		const queue = this.client.player.getQueue(message);

		const voice = message.member.voice.channel;
		if (!voice) return message.quote('You must be connected to a voice channel!');

		if (!queue) return message.quote('No songs are currently playing in this server.');

		if (!number || isNaN(number)) return message.quote('Please provide a valid number');
		if (Number(number > 100)) return message.quote('Volume must be between 0 and 100');

		await this.client.player.setVolume(message, number);

		return message.quote(`Successfully set volume to ${number}%`);
	}

};
