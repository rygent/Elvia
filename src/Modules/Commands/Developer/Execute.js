const Command = require('../../../Structures/Command.js');
const { exec } = require('child_process');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['exec'],
			description: 'Executes commands on the console.',
			category: 'Developer',
			usage: '[command]',
			ownerOnly: true,
			cooldown: 3000
		});
	}

	async run(message, args) {
		exec(args.join(' '), (error, stdout) => {
			const response = stdout || error;
			return message.channel.send({ content: response, split: true, code: true });
		});
	}

};
