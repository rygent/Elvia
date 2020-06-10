const { version } = require('../../../package.json');

module.exports = class {

	constructor(client) {
		this.client = client;
	}

	async run() {
		console.log(`${this.client.user.tag}, ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers!`);

		const activities = [`v${version}`, `${this.client.guilds.cache.size} servers`];
		const commands = [`${this.client.PREFIX}help`, `${this.client.PREFIX}invite`];
		setInterval(() => {
			const activity = `${commands[Math.floor(Math.random() * commands.length)]} | ${activities[Math.floor(Math.random() * activities.length)]}`;
			this.client.user.setPresence({ activity: { name: activity, type: 'LISTENING' }, status: 'dnd' });
		}, 20000);
	}

};
