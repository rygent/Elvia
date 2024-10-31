import { Client } from '@/lib/structures/client.js';
import { Listener } from '@/lib/structures/listener.js';
import { Events, type CloseEvent } from 'discord.js';
import { redBright, underline } from 'colorette';
import { logger } from '@elvia/logger';

export default class extends Listener {
	public constructor(client: Client<true>) {
		super(client, {
			name: Events.ShardDisconnect,
			once: false
		});
	}

	public run(closeEvent: CloseEvent, shardId: number) {
		if (closeEvent.wasClean) {
			logger.info(`${redBright(underline(`${this.client.user.username}`))} is disconnected!`, { shardId });
		} else {
			logger.info(
				`${redBright(underline(`${this.client.user.username}`))} is disconnected! (${closeEvent.code}: ${closeEvent.reason})`,
				{ shardId }
			);
		}
	}
}
