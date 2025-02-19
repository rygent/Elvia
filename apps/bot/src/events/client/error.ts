import { Client } from '@/lib/structures/client.js';
import { Listener } from '@/lib/structures/listener.js';
import { logger } from '@elvia/logger';
import { Events } from 'discord.js';

export default class extends Listener {
	public constructor(client: Client<true>) {
		super(client, {
			name: Events.Error,
			once: false
		});
	}

	public run(error: Error) {
		logger.error(`${error.name}: ${error.message}`, { error });
	}
}
