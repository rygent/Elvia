const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['kill', 'endprocess', 'shut-down'],
			description: 'Shuts down the bot.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	async run(message) {
		try {
			message.reply(`Shutting down ${this.client.user.username} bot ...`);

			setTimeout(() => {
				process.exit();
			}, 5000);
		} catch (err) {
			message.reply(err.message);
		}
	}

};
