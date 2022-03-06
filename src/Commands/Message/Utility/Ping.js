const Command = require('../../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pong'],
			description: 'Send a ping request.',
			category: 'Utility'
		});
	}

	async run(message) {
		return message.reply({ content: [
			`***Websocket:*** \`${Math.round(this.client.ws.ping)}ms\``,
			`***Latency:*** \`${Math.round(Date.now() - message.createdTimestamp)}ms\``
		].join('\n') });
	}

};
