const Command = require('../../../structures/Command.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'ping',
			aliases: ['pong'],
			description: 'Displays bot latency and API response times.',
			category: 'information',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
		});
	}

	async run(message) {
		message.channel.startTyping(true);
		const msg = await message.channel.send('Pinging...');
		const latency = Math.round(msg.createdTimestamp - message.createdTimestamp);

		if (latency <= 0) {
			msg.edit('Please try again...');
		} else {
			msg.edit(stripIndents`
				Latency: \`${latency}ms\`
				Respond: \`${Date.now() - msg.createdTimestamp}ms\`
				API: \`${Math.round(this.client.ws.ping)}ms\``);
		}
		message.channel.stopTyping(true);
	}

};
