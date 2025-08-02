import { CoreEvent, type CoreClient } from '@elvia/core';
import { type RateLimitData } from '@discordjs/rest';
import { logger } from '@elvia/logger';

export default class extends CoreEvent {
	public constructor(client: CoreClient<true>) {
		super(client, {
			name: 'rateLimited',
			once: false,
			emitter: 'rest'
		});
	}

	public run(rateLimitInfo: RateLimitData) {
		const info = [
			`    Route  : ${rateLimitInfo.route}`,
			`    Hash   : ${rateLimitInfo.hash}`,
			`    Method : ${rateLimitInfo.method}`,
			`    Limit  : ${rateLimitInfo.limit}`,
			`    Timeout: ${rateLimitInfo.timeToReset}ms`,
			`    Global : ${rateLimitInfo.global.toString()}`
		].join('\n');

		logger.warn(`Discord API client is rate-limited.\n${info}`);
	}
}
