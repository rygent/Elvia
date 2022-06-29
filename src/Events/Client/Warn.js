import Event from '../../Structures/Event.js';

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'warn',
			once: false
		});
	}

	async run(info) {
		this.client.logger.warn(info);
	}

}
