const Event = require('../../Structures/Event.js');
const { connection } = require('mongoose');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true,
			emitter: connection
		});
	}

	async run() {
		this.client.logger.log({ content: 'Connected to Database!', type: 'ready' });
	}

};
