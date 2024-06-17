import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Event } from '@/lib/structures/Event.js';

export default class extends Event {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'warn',
			once: false
		});
	}

	public run(info: string) {
		this.client.logger.warn(info);
	}
}
