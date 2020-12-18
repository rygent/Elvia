const Event = require('../../Structures/Event.js');
const chalk = require('chalk');
const moment = require('moment');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {
		console.log([
			`[${chalk.grey('INFO')}] Logged in as ${chalk.redBright(`${this.client.user.tag}`)}`,
			`[${chalk.grey('INFO')}] Loaded ${this.client.commands.size.formatNumber()} commands & ${this.client.events.size.formatNumber()} events!`,
			// eslint-disable-next-line max-len
			`[${chalk.grey('INFO')}] Ready in ${this.client.guilds.cache.size.formatNumber()} guilds on ${this.client.channels.cache.size.formatNumber()} channels, for a total of ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).formatNumber()} users.`
		].join('\n'));
		process.stdout.write(`[${chalk.greenBright('BOOT')}] Connected to Discord API!\n`);
		process.stdout.write(`[${chalk.greenBright('BOOT')}] Booted up on ${chalk.blueBright(`${moment().format('MMM D, YYYY HH:mm:ss')} ICT`)}\n`);
	}

};
