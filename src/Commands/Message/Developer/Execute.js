const MessageCommand = require('../../../Structures/Command');
const { Formatters, Util } = require('discord.js');
const { exec } = require('node:child_process');

module.exports = class extends MessageCommand {

	constructor(...args) {
		super(...args, {
			name: 'execute',
			aliases: ['exec'],
			description: 'Executes commands on the console.',
			category: 'Developer',
			usage: '[bash]',
			ownerOnly: true
		});
	}

	async run(message, args) {
		exec(args.join(' '), (error, stdout) => {
			const response = stdout || error;
			return message.channel.send({ content: Util.splitMessage(Formatters.codeBlock(response)).toString() });
		});
	}

};
