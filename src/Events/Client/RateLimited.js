import Event from '../../Structures/Event.js';

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'rateLimited',
			once: false,
			emitter: 'rest'
		});
	}

	async run(rateLimitData) {
		const data = [
			`    Route  : ${rateLimitData.route}`,
			`    Hash   : ${rateLimitData.hash}`,
			`    Method : ${rateLimitData.method}`,
			`    Limit  : ${rateLimitData.limit}`,
			`    Timeout: ${rateLimitData.timeToReset}ms`,
			`    Global : ${rateLimitData.global}`
		].join('\n');

		this.client.logger.warn(`This client being Rate Limited.\n${data}`);
	}

}
