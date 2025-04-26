import { CoreClient, CoreEvent } from '@elvia/core';
import { logger } from '@elvia/logger';
import { Events } from 'discord.js';

export default class extends CoreEvent {
	public constructor(client: CoreClient<true>) {
		super(client, {
			name: Events.Warn,
			once: false
		});
	}

	public run(info: string) {
		logger.warn(info);
	}
}
