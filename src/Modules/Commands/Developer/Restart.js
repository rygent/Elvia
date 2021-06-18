const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['reboot'],
			description: 'Restart the bot.',
			category: 'Developer',
			ownerOnly: true,
			cooldown: 0
		});
	}

	/* eslint-disable consistent-return */
	async run(message) {
		try {
			message.reply(`The bot will restart in 5 seconds, it may take a few minutes for it to boot up again.`);

			setTimeout(() => {
				process.exit(1);
			}, 5000);
		} catch (err) {
			return message.reply(err.message);
		}
	}

};
