import { Client, Listener } from '@elvia/tesseract';
import { Events } from 'discord.js';
import { cyanBright, redBright, underline } from 'colorette';

export default class extends Listener {
	public constructor(client: Client<true>) {
		super(client, {
			name: Events.ShardReconnecting,
			once: false
		});
	}

	public run(shardId: number) {
		this.client.logger.info(
			`${cyanBright(`[${shardId}]`)} ${redBright(underline(`${this.client.user.username}`))} is reconnecting!`
		);
	}
}
