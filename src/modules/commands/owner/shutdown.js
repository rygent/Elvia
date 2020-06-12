const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'shutdown',
			aliases: ['kill', 'endprocess', 'shut-down'],
			description: 'Shuts down the bot.',
			category: 'owner',
			clientPerms: ['SEND_MESSAGES'],
			ownerOnly: true
		});
	}

	async run(message) {
		try {
			await message.channel.send('Shutting down... 👋');
			process.exit();
		} catch (err) {
			message.channel.send(`ERROR: ${err.message}`);
		}
	}

};
