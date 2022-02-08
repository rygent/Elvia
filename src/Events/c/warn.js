const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	async run(info) {
		this.client.logger.log({ content: info, type: 'warn' });
	}

};
