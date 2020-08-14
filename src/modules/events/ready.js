const Event = require('../../structures/Event.js');
const { version } = require('../../../package.json');
const chalk = require('chalk');
const moment = require('moment');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {
		const timestamp = `${moment().format('MMM D, YYYY HH:mm:ss')}`;
		console.log([
			`Logged in as ${chalk.redBright(`${this.client.user.tag}`)}`,
			`Loaded ${this.client.commands.size.formatNumber()} commands & ${this.client.events.size.formatNumber()} events!`,
			// eslint-disable-next-line max-len
			`Ready in ${this.client.guilds.cache.size.formatNumber()} guilds on ${this.client.channels.cache.size.formatNumber()} channels, for a total of ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).formatNumber()} users.`
		].join('\n'));
		process.stdout.write(`[${chalk.greenBright('BOOT')}] Connected to Discord API!\n`);
		process.stdout.write(`[${chalk.greenBright('BOOT')}] Booted up in ${chalk.blueBright(`${(Date.now() - global.startTime) / 1000}s`)} on ${chalk.blueBright(`${timestamp}`)}\n`);

		const activities = [
			`${this.client.guilds.cache.size.formatNumber()} servers`,
			`${this.client.channels.cache.size.formatNumber()} channels`,
			`${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).formatNumber()} users`
		];

		let i = 0;
		setInterval(() => {
			const activity = `${this.client.prefix}help | ${activities[i++ % activities.length]} | v${version}`;
			this.client.user.setPresence({ activity: { type: 'PLAYING', name: activity } });
		}, 20000);
	}

};
