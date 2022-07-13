import Command from '../../../Structures/Command.js';
import { codeBlock } from 'discord.js';
import { splitMessage } from '../../../Structures/Util.js';
import child from 'node:child_process';

export default class extends Command {

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

}
