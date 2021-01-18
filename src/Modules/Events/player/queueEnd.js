const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	async run(message) {
		return message.channel.send(`Queue has ended. No more music to play...`);
	}

};
