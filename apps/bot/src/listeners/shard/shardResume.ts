import { Client, Listener } from '@elvia/tesseract';
import { Events } from 'discord.js';
import { cyanBright, redBright, underline } from 'colorette';

export default class extends Listener {
	public constructor(client: Client<true>) {
		super(client, {
			name: Events.ShardResume,
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
