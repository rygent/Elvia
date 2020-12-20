const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['kill', 'endprocess', 'shut-down'],
			description: 'Shuts down the bot.',
			category: 'Developer',
			ownerOnly: true,
			cooldown: 0
		});
	}

	async run(message) {
		try {
			message.quote(`Shutting down ${this.client.user.username} bot ...`);

			setTimeout(() => {
				process.exit();
			}, 5000);
		} catch (err) {
			message.quote(err.message);
		}
	}

};
