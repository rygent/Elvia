const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	async run(message) {
		return message.channel.send(`I've just stopped the music as I have been disconnected from the channel.`);
	}

};
