import Event from '../../Structures/Event.js';
import mongoose from 'mongoose';
const { connection } = mongoose;

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'disconnected',
			once: false,
			emitter: connection
		});
	}

	async run() {
		this.client.logger.warn('Disconnected from MongoDB!');
	}

}
