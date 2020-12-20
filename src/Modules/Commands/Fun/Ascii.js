const Command = require('../../../Structures/Command.js');
const figlet = require('util').promisify(require('figlet'));

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Turn your text into ascii characters!',
			category: 'Fun',
			usage: '<text>',
			cooldown: 5000
		});
	}

	async run(message, args) {
		const text = args.join(' ');
		if (!text || text.length > 20) return message.quote('Please enter a valid text (less than 20 characters)!');

		return message.channel.send(await figlet(text), { code: true });
	}

};
