const Event = require('../Structures/Event.js');
const chalk = require('chalk');
const moment = require('moment');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {
		this.client.logger.log({ content: `Logged in as ${chalk.redBright(`${this.client.user.tag}`)}` });
		this.client.logger.log({ content: `Loaded ${this.client.commands.size.formatNumber()} commands, ${this.client.interactions.size.formatNumber()} interactions & ${this.client.events.size.formatNumber()} events!` });
		this.client.logger.log({ content: `Ready in ${this.client.guilds.cache.size.formatNumber()} guilds on ${this.client.channels.cache.size.formatNumber()} channels, for a total of ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).formatNumber()} users.` });
		this.client.logger.log({ content: 'Connected to Discord API!', type: 'ready' });
		this.client.logger.log({ content: `Booted up on ${chalk.blueBright(`${moment().format('dddd, MMM D, YYYY HH:mm:ss')}`)}`, type: 'ready' });
	}

};
