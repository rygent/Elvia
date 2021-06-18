const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['kill', 'endprocess', 'shut-down'],
			description: 'Shutdown bots.',
			category: 'Developer',
			ownerOnly: true,
			cooldown: 0
		});
	}

	/* eslint-disable consistent-return */
	async run(message) {
		try {
			message.reply(`Shutdown the bot in 5 seconds.`);

			setTimeout(() => {
				process.exit();
			}, 5000);
		} catch (err) {
			return message.reply(err.message);
		}
	}

};
