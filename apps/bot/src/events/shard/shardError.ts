import { CoreEvent, type CoreClient } from '@elvia/core';
import { Events } from 'discord.js';
import { redBright, underline } from 'colorette';
import { logger } from '@elvia/logger';

export default class extends CoreEvent {
	public constructor(client: CoreClient<true>) {
		super(client, {
			name: Events.ShardError,
			once: false
		});
	}

	public run(error: Error, shardId: number) {
		logger.info(`${redBright(underline(`${this.client.user.username}`))} is error!`, { shardId });
		logger.error(`${error.name}: ${error.message}`, { error, shardId });
	}
}
