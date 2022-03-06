const Event = require('../../Structures/Event');
const { connection } = require('mongoose');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'error',
			emitter: connection
		});
	}

	async run(error) {
		this.client.logger.error(`Unable to connect MongoDB:\n${error.stack}`);
	}

};
