const Event = require('../Structures/Event');
const colorette = require('colorette');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {
		this.client.logger.log(`Logged in as ${colorette.redBright(`${this.client.user.tag}`)}`, { status: 'BOOT', color: 'greenBright' });
		this.client.logger.log(`Loaded ${(this.client.commands.size + this.client.interactions.size).toLocaleString()} commands & ${this.client.events.size.toLocaleString()} events!`);

		const activities = [
			{ name: `${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} users`, type: 'LISTENING' },
			{ name: `${this.client.guilds.cache.size.toLocaleString()} servers`, type: 'WATCHING' }
		];

		let i = 0;
		setInterval(() => {
			this.client.user.setActivity(activities[i++ % activities.length]);
		}, 30_000);
	}

};
