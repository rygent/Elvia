import { Client, Listener } from '@elvia/tesseract';
import { Events } from 'discord.js';

export default class extends Listener {
	public constructor(client: Client<true>) {
		super(client, {
			name: Events.Debug,
			once: false
		});
	}

	public run(info: string) {
		if (!this.client.settings.debug) return;
		this.client.logger.debug(info);
	}
}
