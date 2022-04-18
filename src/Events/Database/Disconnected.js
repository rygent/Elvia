const Event = require('../../Structures/Event');
const { connection } = require('mongoose');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'disconnected',
			once: false,
			emitter: connection
		});
	}

	async run() {
		this.client.logger.warn('Disconnected from MongoDB!');
	}

};
