const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Become an AFK (members who mention you will receive a message).',
			category: 'utility',
			clientPerms: ['SEND_MESSAGES'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, args, data) {
		const reason = args.join(' ');
		if (!reason) {
			return message.channel.send('Please specify the reason for your afk!');
		}

		// Send success message
		message.channel.send(`You passed afk (reason: ${reason})`);

		data.userData.afk = reason;
		data.userData.save();
	}

};
