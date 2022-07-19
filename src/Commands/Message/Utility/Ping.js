import Command from '../../../Structures/Command.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'ping',
			aliases: ['pong'],
			description: 'Send a ping request.',
			category: 'Utility',
			disabled: true
		});
	}

	async run(message) {
		const replies = [
			`***Websocket:*** \`${Math.round(this.client.ws.ping)}ms\``,
			`***Latency:*** \`${Math.round(Date.now() - message.createdTimestamp)}ms\``
		].join('\n');

		return message.reply({ content: replies });
	}

}
