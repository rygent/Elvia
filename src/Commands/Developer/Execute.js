const Command = require('../../Structures/Command.js');
const { Formatters: { codeBlock }, Util: { splitMessage } } = require('discord.js');
const { exec } = require('child_process');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['exec'],
			description: 'Executes commands on the console.',
			category: 'Developer',
			usage: '[command]',
			ownerOnly: true
		});
	}

	async run(message, args) {
		exec(args.join(' '), (error, stdout) => {
			const response = stdout || error;
			return message.channel.send({ content: splitMessage(codeBlock(response)).toString() });
		});
	}

};
