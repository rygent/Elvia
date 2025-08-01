import { CoreEvent, type CoreClient } from '@elvia/core';
import { Events } from 'discord.js';
import { logger } from '@elvia/logger';

export default class extends CoreEvent {
	public constructor(client: CoreClient<true>) {
		super(client, {
			name: Events.Error,
			once: false
		});
	}

	public run(error: Error) {
		logger.error(`${error.name}: ${error.message}`, { error });
	}
}
