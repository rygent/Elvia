const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	async run(message, queue, playlist) {
		return message.channel.send(`${playlist.items.length} songs added to the queue!`);
	}

};
