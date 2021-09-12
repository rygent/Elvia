const Command = require('../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Giving reasons when being AFK',
			category: 'Utilities',
			usage: '[reason]',
			cooldown: 3000
		});
	}

	async run(message, args, data) {
		const reason = args.join(' ');
		if (!reason) return message.reply({ content: 'Please enter your reason!' });

		data.user.afk.enabled = true;
		data.user.afk.since = Date.now();
		data.user.afk.reason = reason;
		data.user.markModified('afk');
		await data.user.save();

		return message.reply({ content: `You're now AFK!\n***Reason:*** ${reason}` });
	}

};
