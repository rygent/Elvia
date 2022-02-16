const Event = require('../../Structures/Event');
const { connection } = require('mongoose');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'disconnected',
			emitter: connection
		});
	}

	async run() {
		this.client.logger.log({ content: 'Disconnected from Database!', type: 'warn' });
	}

};
