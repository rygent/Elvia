import { CoreClient, CoreEvent } from '@elvia/core';
import { Events } from 'discord.js';
import { logger } from '@elvia/logger';
import { isExtendedSettings } from '@/lib/settings.js';

export default class extends CoreEvent {
	public constructor(client: CoreClient<true>) {
		super(client, {
			name: Events.Debug,
			once: false
		});
	}

	public run(info: string) {
		if (isExtendedSettings(this.client.settings) && !this.client.settings.debug) return;
		logger.debug(info);
	}
}
