const Command = require('../../../structures/Command.js');
const { exec } = require('child_process');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['exec'],
			description: 'Executes commands in the console.',
			category: 'owner',
			usage: '<query>',
			clientPerms: ['SEND_MESSAGES'],
			ownerOnly: true
		});
	}

	/* eslint-disable consistent-return */
	async run(message, args) {
		exec(args.join(' '), (error, stdout) => {
			const response = stdout || error;
			message.channel.send(response, { split: true, code: true });
		});
	}

};
