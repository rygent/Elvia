const Event = require('../../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: process
		});
	}

	async run(error) {
		this.client.logger.log({ content: error.stack, type: 'error' });
	}

};
