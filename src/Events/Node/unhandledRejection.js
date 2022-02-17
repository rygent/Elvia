const Event = require('../../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: process
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(error, promise) {
		this.client.logger.error(error.stack);
	}

};
