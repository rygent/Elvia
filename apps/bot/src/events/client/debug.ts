import { Client } from '@/lib/structures/client.js';
import { Listener } from '@/lib/structures/listener.js';
import { logger } from '@elvia/logger';
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
		logger.debug(info);
	}
}
