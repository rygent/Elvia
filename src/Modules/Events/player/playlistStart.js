const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	async run(message, queue, playlist, track) {
		return message.channel.send(`Starting playlist **${playlist.title}**. Playing the first song, **${track.title}**!`);
	}

};
