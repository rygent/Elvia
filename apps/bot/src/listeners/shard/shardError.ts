import { Client, Listener } from '@elvia/tesseract';
import { Events } from 'discord.js';
import { redBright, underline } from 'colorette';
import { logger } from '@elvia/logger';

export default class extends Listener {
	public constructor(client: Client<true>) {
		super(client, {
			name: Events.ShardError,
			once: false
		});
	}

	public run(error: Error, shardId: number) {
		logger.info(`Shard ${shardId} - ${redBright(underline(`${this.client.user.username}`))} is error!`);
		logger.error(`${error.name}: ${error.message}`, { error });
	}
}
