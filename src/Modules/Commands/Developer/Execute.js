const Command = require('../../../Structures/Command.js');
const { exec } = require('child_process');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['exec'],
			description: 'Executes commands in the console.',
			category: 'Developer',
			usage: '<query>',
			ownerOnly: true,
			cooldown: 3000
		});
	}

	async run(message, args) {
		exec(args.join(' '), (error, stdout) => {
			const response = stdout || error;
			message.channel.send(response, { split: true, code: true });
		});
	}

};
