const { version } = require('../../../package.json');
const moment = require('moment');

module.exports = class {

	constructor(client) {
		this.client = client;
	}

	async run() {
		const timestamp = `${moment().format('ddd, MMM D, YYYY HH:mm:ss')} ->`;
		const logString = `${timestamp} Logged in as ${this.client.user.tag}!`;
		const readyString = `${timestamp} Ready in ${this.client.guilds.cache.size} guilds on ${this.client.channels.cache.size} channels, for a total of ${this.client.users.cache.size} users.`;
		console.log(logString);
		console.log(readyString);

		const activities = [`v${version}`, `${this.client.guilds.cache.size.formatNumber()} servers`];
		const commands = [`help`, `invite`];
		setInterval(() => {
			const activity = `${this.client.prefix}${commands.random()} | ${activities.random()}`;
			this.client.user.setPresence({ activity: { type: 'PLAYING', name: activity } });
		}, 20000);
	}

};
