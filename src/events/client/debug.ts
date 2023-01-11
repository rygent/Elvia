import type BaseClient from '../../lib/BaseClient.js';
import Event from '../../lib/structures/Event.js';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'debug',
			once: false
		});
	}

	public run(info: string) {
		if (!this.client.debug) return;
		this.client.logger.debug(info);
	}
}
