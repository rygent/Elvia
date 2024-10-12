import { Client, Listener } from '@elvia/tesseract';
import { Events, type CloseEvent } from 'discord.js';
import { cyanBright, redBright, underline } from 'colorette';

export default class extends Listener {
	public constructor(client: Client<true>) {
		super(client, {
			name: Events.ShardDisconnect,
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
