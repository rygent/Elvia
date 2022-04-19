const Event = require('../../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'rateLimited',
			once: false,
			emitter: 'rest'
		});
	}

	async run(data) {
		this.client.logger.warn(data);
	}

};
