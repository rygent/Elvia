import type BaseClient from '../../../lib/BaseClient.js';
import Command from '../../../lib/structures/Command.js';
import { AttachmentBuilder, Message } from 'discord.js';
import { codeBlock } from '@discordjs/formatters';
import { exec } from 'node:child_process';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'execute',
			aliases: ['exec'],
			description: 'Executes any Bash command.',
			category: 'Developer',
			usage: '[bash]',
			ownerOnly: true
		});
	}

	public execute(message: Message<false>, args: string[]) {
		const bash = args.join(' ');

		exec(bash, (error, stdout) => {
			const replies = codeBlock('console', stdout ?? error).toString();

			if (replies.length <= 2e3) {
				return message.channel.send({ content: replies });
			}

			const attachment = new AttachmentBuilder(Buffer.from((stdout ?? error).toString())).setName('output.txt');

			return message.channel.send({
				content: 'Output was too long! The result has been sent as a file.',
				files: [attachment]
			});
		});
	}
}
