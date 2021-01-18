const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	async run(message) {
		return message.channel.send(`Cannot be find on Youtube!`);
	}

};
