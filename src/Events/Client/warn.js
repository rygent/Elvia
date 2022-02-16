const Event = require('../../Structures/Event');

module.exports = class extends Event {

	async run(info) {
		this.client.logger.log({ content: info, type: 'warn' });
	}

};
