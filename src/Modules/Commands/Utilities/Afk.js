const Command = require('../../../Structures/Command.js');

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

	async run(message, args) {
		const reason = args.join(' ');
		if (!reason) return message.quote('Please enter your reason!');

		const userData = await this.client.findOrCreateUser({ id: message.author.id });

		userData.afk = reason;
		userData.save();

		return message.quote(`You're now AFK!\n***Reason:*** ${reason}`);
	}

};
