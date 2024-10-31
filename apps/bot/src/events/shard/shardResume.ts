import { Client } from '@/lib/structures/client.js';
import { Listener } from '@/lib/structures/listener.js';
import { Events } from 'discord.js';
import { redBright, underline } from 'colorette';
import { logger } from '@elvia/logger';

export default class extends Listener {
	public constructor(client: Client<true>) {
		super(client, {
			name: Events.ShardResume,
			once: false
		});
	}

	// @ts-expect-error TS6133: 'replayedEvents' is declared but its value is never read.
	public run(shardId: number, replayedEvents: number) {
		logger.info(`${redBright(underline(`${this.client.user.username}`))} is resumed!`, { shardId });
	}
}
