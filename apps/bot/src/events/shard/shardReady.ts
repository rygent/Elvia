import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Event } from '@/lib/structures/Event.js';
import { cyanBright, redBright, underline } from 'colorette';

export default class extends Event {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'shardReady',
			once: true
		});
	}

	public run(shardId: number) {
		this.client.logger.info(
			`${cyanBright(`[${shardId}]`)} ${redBright(underline(`${this.client.user.username}`))} is ready!`
		);
	}
}
