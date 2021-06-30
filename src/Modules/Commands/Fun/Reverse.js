const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Sends the same message that you had sent but reversed.',
			category: 'Fun',
			usage: '[text]',
			cooldown: 5000
		});
	}

	async run(message, args) {
		const text = args.join(' ');
		const converted = text.split('').reverse().join('');

		return message.reply(converted);
	}

};
