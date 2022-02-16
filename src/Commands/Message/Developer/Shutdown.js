const Command = require('../../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['kill', 'endprocess', 'shut-down'],
			description: 'Shutdown bots.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	async run(message) {
		try {
			await message.reply({ content: `Shutdown the bot in 5 seconds.` });

			setTimeout(() => {
				process.exit();
			}, 5000);
		} catch (error) {
			return message.reply({ content: error.message });
		}
	}

};
