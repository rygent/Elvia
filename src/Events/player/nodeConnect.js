const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	async run(node) {
		this.client.logger.log({ content: `Connected to ${node.options.identifier} host!`, type: 'ready' });
	}

};
