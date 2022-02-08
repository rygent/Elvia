const Event = require('../../Structures/Event.js');
const { connection } = require('mongoose');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'error',
			emitter: connection
		});
	}

	async run(error) {
		this.client.logger.log({ content: `Unable to connect Database!\nError: ${error}`, type: 'error' });
	}

};
