const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['reboot'],
			description: 'If running under PM2, the bot will restart.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	async run(message) {
		try {
			message.reply(`Rebooting ${this.client.user.username} bot ...\n__*Please wait a few minutes*__`);

			setTimeout(() => {
				process.exit(1);
			}, 5000);
		} catch (err) {
			message.reply(err.message);
		}
	}

};
