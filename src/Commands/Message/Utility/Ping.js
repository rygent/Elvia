const MessageCommand = require('../../../Structures/Command');

module.exports = class extends MessageCommand {

	constructor(...args) {
		super(...args, {
			name: 'ping',
			aliases: ['pong'],
			description: 'Send a ping request.',
			category: 'Utility'
		});
	}

	async run(message) {
		const content = [
			`***Websocket:*** \`${Math.round(this.client.ws.ping)}ms\``,
			`***Latency:*** \`${Math.round(Date.now() - message.createdTimestamp)}ms\``
		].join('\n');

		return message.reply({ content });
	}

};
