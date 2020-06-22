const { version } = require('../../../package.json');

module.exports = class {

	constructor(client) {
		this.client = client;
	}

	async run() {
		console.log(`${this.client.user.tag}, ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers!`);

		const activities = [`v${version}`, `${this.client.guilds.cache.size} servers`];
		const commands = [`help`, `invite`];
		setInterval(() => {
			const activity = `${this.client.prefix}${commands[Math.floor(Math.random() * commands.length)]} | ${activities[Math.floor(Math.random() * activities.length)]}`;
			this.client.user.setActivity(activity, { type: 'PLAYING' });
		}, 20000);
	}

};
