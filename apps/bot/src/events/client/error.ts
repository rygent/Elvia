import type { BaseClient } from '#lib/structures/BaseClient.js';
import { Event } from '#lib/structures/Event.js';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'error',
			once: false
		});
	}

	public run(error: Error) {
		this.client.logger.error(`${error.name}: ${error.message}`, error, true);
	}
}
