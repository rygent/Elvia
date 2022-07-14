const Event = require('../../Structures/Event');

module.exports = class extends Event {

	async run(data) {
		this.client.logger.warn(data);
	}

};
