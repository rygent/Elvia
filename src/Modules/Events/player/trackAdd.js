const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	async run(message, queue, track) {
		return message.channel.send(`${track.title} has been added to the queue!`);
	}

};
