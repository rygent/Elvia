const Command = require('../../Structures/Command.js');
const { Formatters: { codeBlock } } = require('discord.js');
const figlet = require('util').promisify(require('figlet'));

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['bigtext', 'banner'],
			description: 'Change text letters to ascii characters.',
			category: 'Fun',
			usage: '[text]',
			cooldown: 3000
		});
	}

	async run(message, args) {
		const text = args.join(' ');
		if (!text || text.length > 20) return message.reply({ content: 'Please enter text that is no longer than 20 characters!' });

		return message.channel.send({ content: codeBlock(await figlet(text)) });
	}

};
