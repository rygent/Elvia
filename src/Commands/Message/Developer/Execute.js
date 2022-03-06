const Command = require('../../../Structures/Command');
const { Formatters, Util } = require('discord.js');
const { exec } = require('node:child_process');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
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
