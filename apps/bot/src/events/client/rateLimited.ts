import type { BaseClient } from '#lib/BaseClient.js';
import { Event } from '#lib/structures/Event.js';
import type { RateLimitData } from '@discordjs/rest';

export default class extends Event {
	public constructor(client: BaseClient) {
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

		this.client.logger.warn(`Discord API client is rate-limited.\n${info}`);
	}
}
