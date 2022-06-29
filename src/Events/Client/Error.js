import Event from '../../Structures/Event.js';

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'error',
			once: false
		});
	}

	async run(error) {
		this.client.logger.error(error.stack, error);
	}

}
