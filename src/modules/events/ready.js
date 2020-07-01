const Event = require('../../structures/Event.js');
const { version } = require('../../../package.json');
const moment = require('moment');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {
		const timestamp = `${moment().format('ddd, MMM D, YYYY HH:mm:ss')} ->`;
		console.log([
			`${timestamp} Logged in as ${this.client.user.tag}!`,
			`${timestamp} Loaded ${this.client.commands.size} commands!`,
			`${timestamp} Loaded ${this.client.events.size} events!`,
			`${timestamp} Ready in ${this.client.guilds.cache.size} guilds on ${this.client.channels.cache.size} channels, for a total of ${this.client.users.cache.size} users.`
		].join('\n'));

		const activities = [`v${version}`, `${this.client.guilds.cache.size.formatNumber()} servers`];
		const commands = [`help`, `invite`];
		setInterval(() => {
			const activity = `${this.client.prefix}${commands.random()} | ${activities.random()}`;
			this.client.user.setPresence({ activity: { type: 'PLAYING', name: activity } });
		}, 20000);
	}

};
