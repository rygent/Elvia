const Event = require('../../Structures/Event.js');
const { version } = require('../../../package.json');
const chalk = require('chalk');
const moment = require('moment');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	/* eslint-disable max-len */
	async run() {
		await this.client.utils.loadInteractions();

		console.log([
			`[${chalk.grey('INFO')}] Logged in as ${chalk.redBright(`${this.client.user.tag}`)}`,
			`[${chalk.grey('INFO')}] Loaded ${this.client.commands.size.formatNumber()} commands, ${this.client.interactions.size.formatNumber()} interactions & ${this.client.events.size.formatNumber()} events!`,
			`[${chalk.grey('INFO')}] Ready in ${this.client.guilds.cache.size.formatNumber()} guilds on ${this.client.channels.cache.size.formatNumber()} channels, for a total of ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).formatNumber()} users.`
		].join('\n'));
		process.stdout.write(`[${chalk.greenBright('BOOT')}] Connected to Discord API!\n`);
		process.stdout.write(`[${chalk.greenBright('BOOT')}] Booted up on ${chalk.blueBright(`${moment().format('dddd, MMM D, YYYY HH:mm:ss')}`)}\n`);

		const checkUnmutes = require('../../Utils/checkUnmutes.js');
		checkUnmutes.init(this.client);

		const activities = [
			`${this.client.prefix}help`,
			`@${this.client.user.username} help`
		];

		let i = 0;
		setInterval(() => {
			this.client.user.setActivity({ name: `${activities[i++ % activities.length]} | v${version}`, type: 'PLAYING' });
		}, 20000);
	}

};
