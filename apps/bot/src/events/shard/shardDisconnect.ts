import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Event } from '@/lib/structures/Event.js';
import type { CloseEvent } from 'discord.js';
import { cyanBright, redBright, underline } from 'colorette';

export default class extends Event {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'shardDisconnect',
			once: false
		});
	}

	public run(closeEvent: CloseEvent, shardId: number) {
		if (closeEvent.wasClean) {
			this.client.logger.info(
				`${cyanBright(`[${shardId}]`)} ${redBright(underline(`${this.client.user.username}`))} is disconnected!`
			);
		} else {
			this.client.logger.info(
				`${cyanBright(`[${shardId}]`)} ${redBright(underline(`${this.client.user.username}`))} is disconnected! (${closeEvent.code}: ${closeEvent.reason})`
			);
		}
	}
}
