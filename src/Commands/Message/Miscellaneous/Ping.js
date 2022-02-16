const Command = require('../../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pong'],
			description: 'Send a ping request.',
			category: 'Miscellaneous'
		});
	}

	async run(message) {
		return message.reply({ content: [
			`***Websocket:*** \`${Math.round(this.client.ws.ping)}ms\``,
			`***REST:*** \`${Math.round(Date.now() - message.createdTimestamp)}ms\``
		].join('\n') });
	}

};
