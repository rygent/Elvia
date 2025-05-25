import { CoreClient, CoreEvent } from '@elvia/core';
import { Events } from 'discord.js';
import { logger } from '@elvia/logger';

export default class extends CoreEvent {
	public constructor(client: CoreClient<true>) {
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
