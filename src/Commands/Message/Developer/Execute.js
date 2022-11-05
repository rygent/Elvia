import Command from '../../../Structures/Command.js';
import { AttachmentBuilder, codeBlock } from 'discord.js';
import { exec } from 'node:child_process';

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
		exec(args.join(' '), (error, stdout) => {
			const replies = codeBlock('shell', stdout || error).toString();
			if (replies.length <= 2000) {
				return message.channel.send({ content: replies });
			} else {
				const attachment = new AttachmentBuilder()
					.setFile(Buffer.from((stdout || error).toString()))
					.setName('output.txt');

				return message.channel.send({ content: 'Output was too long! The result has been sent as a file.', files: [attachment] });
			}
		});
	}

}
