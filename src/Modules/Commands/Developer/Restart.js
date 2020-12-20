const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['reboot'],
			description: 'If running under PM2, the bot will restart.',
			category: 'Developer',
			ownerOnly: true,
			cooldown: 0
		});
	}

	async run(message) {
		try {
			message.quote(`Rebooting ${this.client.user.username} bot ...\n__*Please wait a few minutes*__`);

			setTimeout(() => {
				process.exit(1);
			}, 5000);
		} catch (err) {
			message.quote(err.message);
		}
	}

};
