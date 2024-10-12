import { Client, Listener } from '@elvia/tesseract';
import { Events } from 'discord.js';

export default class extends Listener {
	public constructor(client: Client<true>) {
		super(client, {
			name: Events.Error,
			once: false
		});
	}

	public run(error: Error) {
		this.client.logger.error(`${error.name}: ${error.message}`, error);
	}
}
