const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	async run(message, queue, tracks) {
		return message.channel.send(`Please specify a valid number between **1** and **${tracks.length}**!`);
	}

};
