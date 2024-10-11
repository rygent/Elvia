import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Event } from '@/lib/structures/Event.js';
import { cyanBright, redBright, underline } from 'colorette';

export default class extends Event {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'shardReconnecting',
			once: false
		});
	}

	// @ts-expect-error TS6133: 'replayedEvents' is declared but its value is never read.
	public run(shardId: number, replayedEvents: number) {
		this.client.logger.info(
			`${cyanBright(`[${shardId}]`)} ${redBright(underline(`${this.client.user.username}`))} is resumed!`
		);
	}
}
