const Event = require('../Structures/Event');
const chalk = require('chalk');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {
		this.client.logger.log({ content: `Logged in as ${chalk.redBright(`${this.client.user.tag}`)}` });
		this.client.logger.log({ content: `Loaded ${(this.client.commands.size + this.client.interactions.size).toLocaleString()} commands & ${this.client.events.size.toLocaleString()} events!` });
		this.client.logger.log({ content: `Ready in ${this.client.guilds.cache.size.toLocaleString()} guilds on ${this.client.channels.cache.size.toLocaleString()} channels, for a total of ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} users.` });
		this.client.logger.log({ content: 'Connected to Discord API!', type: 'ready' });

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
