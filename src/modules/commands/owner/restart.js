const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'restart',
			aliases: ['reboot'],
			description: 'If running under PM2, the bot will restart.',
			category: 'owner',
			clientPerms: ['SEND_MESSAGES'],
			ownerOnly: true
		});
	}

	async run(message) {
		try {
			await message.channel.send('Rebooting, please wait...');
			process.exit(1);
		} catch (err) {
			message.channel.send(`ERROR: ${err.message}`);
		}
	}

};
