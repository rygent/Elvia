import mongoose from 'mongoose';
import Event from '../../Structures/Event.js';
const { connection } = mongoose;

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'open',
			once: true,
			emitter: connection
		});
	}

	async run() {
		this.client.logger.log('Connected to MongoDB!', { infix: 'BOOT', color: 'greenBright' });
	}

}
