import mongoose from 'mongoose';
import Event from '../../Structures/Event.js';
const { connection } = mongoose;

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'reconnected',
			once: false,
			emitter: connection
		});
	}

	async run() {
		this.client.logger.debug('Reconnecting to MongoDB!');
	}

}
