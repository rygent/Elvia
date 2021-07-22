const Event = require('../../Structures/Event.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: 'manager'
		});
	}

	async run(node, error) {
		this.client.logger.log({ content: `Unable to connect ${node.options.identifier} host!\nError: ${error.message}`, type: 'error' });
	}

};
