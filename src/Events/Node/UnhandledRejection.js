const Event = require('../../Structures/Event');
const process = require('node:process');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'unhandledRejection',
			once: false,
			emitter: process
		});
	}

	async run(error, promise) { // eslint-disable-line no-unused-vars
		this.client.logger.error(error.stack);
	}

};
