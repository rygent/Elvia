const Event = require('../Structures/Event');
const Colorette = require('colorette');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'ready',
			once: true
		});
	}

	async run() {
		this.client.logger.log(`Logged in as ${Colorette.redBright(`${this.client.user.tag}`)}`, { infix: 'BOOT', color: 'greenBright' });
		this.client.logger.log(`Loaded ${(this.client.commands.size + this.client.interactions.size).formatNumber()} commands & ${this.client.events.size.formatNumber()} events!`);
	}

};
