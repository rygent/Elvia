const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	async run(data) {
		this.client.manager.updateVoiceState(data);
	}

};
