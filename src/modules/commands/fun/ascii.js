const Command = require('../../../structures/Command.js');
const figlet = require('figlet');
const { promisify } = require('util');
const figletAsync = promisify(figlet);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Turn your text into ascii characters!',
			category: 'fun',
			usage: '<text>',
			clientPerms: ['SEND_MESSAGES'],
			cooldown: 5000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, args) {
		const text = args.join(' ');
		if (!text || text.length > 20) return message.channel.send('Please enter a valid text (less than 20 characters)!');

		const rendered = await figletAsync(text);
		message.channel.send(`\`\`\`${rendered}\`\`\``);
	}

};
