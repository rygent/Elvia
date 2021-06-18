const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pong'],
			description: 'Shows Bot latency & API response time.',
			category: 'Utilities'
		});
	}

	async run(message) {
		const msg = await message.reply('Pinging...');
		const latency = Math.round(msg.createdTimestamp - message.createdTimestamp);

		if (latency <= 0) {
			msg.edit('Please try again later!');
		} else {
			msg.edit([
				`💓 ***Heartbeat:*** \`${Math.round(this.client.ws.ping)}ms\``,
				`⏱️ ***Latency:*** \`${latency}ms\``
			].join('\n'));
		}
	}

};
