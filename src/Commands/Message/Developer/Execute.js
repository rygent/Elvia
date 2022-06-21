const Command = require('../../../Structures/Command');
const { codeBlock } = require('discord.js');
const { splitMessage } = require('../../../Utils/Function');
const child = require('node:child_process');

module.exports = class extends Command {

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
		child.exec(args.join(' '), (error, stdout) => {
			const response = stdout || error;
			return message.channel.send({ content: splitMessage(codeBlock(response)).toString() });
		});
	}

};
