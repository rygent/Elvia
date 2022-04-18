const Event = require('../Structures/Event');
const { ActivityType } = require('discord-api-types/v10');
const Colorette = require('colorette');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'ready',
			once: true
		});
	}

	async run() {
		this.client.logger.log(`Logged in as ${Colorette.redBright(`${this.client.user.tag}`)}`, { status: 'READY', color: 'greenBright' });
		this.client.logger.log(`Loaded ${(this.client.commands.size + this.client.interactions.size).formatNumber()} commands & ${this.client.events.size.formatNumber()} events!`);

		const activities = [
			{ name: `${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).formatNumber()} users`, type: ActivityType.Listening },
			{ name: `${this.client.guilds.cache.size.formatNumber()} servers`, type: ActivityType.Watching }
		];

		let i = 0;
		setInterval(() => {
			this.client.user.setActivity(activities[i++ % activities.length]);
		}, 30_000);
	}

};
