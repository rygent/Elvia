const Command = require('../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['reboot'],
			description: 'Restart the bot.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	async run(message) {
		try {
			await message.reply({ content: `The bot will restart in 5 seconds, it may take a few minutes for it to boot up again.` });

			setTimeout(() => {
				process.exit(1);
			}, 5000);
		} catch (error) {
			return message.reply({ content: error.message });
		}
	}

};
