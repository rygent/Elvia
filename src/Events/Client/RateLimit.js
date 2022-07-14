const Event = require('../../Structures/Event');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'rateLimit'
		});
	}

	async run(data) {
		this.client.logger.warn(data);
	}

};
