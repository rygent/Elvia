const Command = require('../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['hallo']
		});
	}

	async run(message) {
		message.channel.send('Hello!');
	}

};
