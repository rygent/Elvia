const Event = require('../../Structures/Event');
const { connection } = require('mongoose');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'reconnected',
			emitter: connection
		});
	}

	async run() {
		this.client.logger.debug('Reconnecting to MongoDB!');
	}

};
