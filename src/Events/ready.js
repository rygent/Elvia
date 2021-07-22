const Event = require('../Structures/Event.js');
const { version } = require('../../package.json');
const chalk = require('chalk');
const moment = require('moment');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {
		await this.client.utils.loadSlashes();
		await this.client.manager.init(this.client.user.id);

		this.client.logger.log({ content: `Logged in as ${chalk.redBright(`${this.client.user.tag}`)}` });
		this.client.logger.log({ content: `Loaded ${this.client.commands.size.formatNumber()} commands, ${this.client.slashes.size.formatNumber()} slashes & ${this.client.events.size.formatNumber()} events!` });
		this.client.logger.log({ content: `Ready in ${this.client.guilds.cache.size.formatNumber()} guilds on ${this.client.channels.cache.size.formatNumber()} channels, for a total of ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).formatNumber()} users.` });
		this.client.logger.log({ content: 'Connected to Discord API!', type: 'ready' });
		this.client.logger.log({ content: `Booted up on ${chalk.blueBright(`${moment().format('dddd, MMM D, YYYY HH:mm:ss')}`)}`, type: 'ready' });

		const checkValid = new (require('../Helpers/checkValid.js'))(this.client);
		checkValid.validate();

		const checkUnmutes = require('../Helpers/checkUnmutes.js');
		checkUnmutes.init(this.client);

		const activities = [
			`@${this.client.user.username} help | v${version}`,
			`${this.client.prefix}help | ${this.client.guilds.cache.size.formatNumber()} guilds`,
			`Slash command available now!`
		];

		let i = 0;
		setInterval(() => {
			this.client.user.setActivity({ name: activities[i++ % activities.length], type: 'PLAYING' });
		}, 60000);
	}

};
