const Event = require('../../Structures/Event');

module.exports = class extends Event {

	async run(error) {
		this.client.logger.log({ content: error.stack, type: 'error' });
	}

};
