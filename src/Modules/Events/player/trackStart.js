const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	async run(message, track) {
		return message.channel.send(`Now playing **${track.title}**`);
	}

};
