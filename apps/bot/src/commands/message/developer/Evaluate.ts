import type { BaseClient } from '#lib/structures/BaseClient.js';
import { Command } from '#lib/structures/Command.js';
import { AttachmentBuilder, Message } from 'discord.js';
import { codeBlock, inlineCode } from '@discordjs/formatters';
import { Emojis } from '#lib/utils/Constants.js';
import { Type } from '@anishshobith/deeptype';
import { inspect } from 'node:util';

export default class extends Command {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'evaluate',
			aliases: ['eval'],
			description: 'Evaluates any JavaScript code.',
			category: 'Developer',
			usage: '[code]',
			ownerOnly: true
		});
	}

	public async execute(message: Message<false>, args: string[]) {
		if (!args.length) return message.reply({ content: `Please enter the javascript code that will be evaluated.` });

		let code = args.join(' ');
		code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

		let evaled;
		try {
			const start = process.hrtime();
			evaled = eval(code);
			if (evaled instanceof Promise) {
				evaled = await evaled;
			}
			const stop = process.hrtime(start);
			const replies = [
				`${codeBlock('js', this.clean(inspect(evaled, { depth: 2 })))}\n`,
				`${Emojis.Info} ${inlineCode(new Type(evaled).is)} `,
				`${Emojis.Alarm} ${inlineCode(`${(stop[0] * 1e9 + stop[1]) / 1e6}ms`)}`
			].join('');
			if (replies.length <= 2e3) {
				return await message.channel.send({ content: replies });
			}
			const attachment = new AttachmentBuilder(Buffer.from(this.clean(inspect(evaled, { depth: 2 })))).setName(
				'output.txt'
			);

			return await message.channel.send({
				content: 'Output was too long! The result has been sent as a file.',
				files: [attachment]
			});
		} catch (error) {
			const replies = [`${codeBlock('xl', error as string)}`, `${Emojis.Info} ${inlineCode(new Type(error).is)}`].join(
				'\n'
			);

			return message.reply({ content: replies });
		}
	}

	private clean(content: any) {
		if (typeof content !== 'string') return content;
		const cleaned = content
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)
			.replace(
				new RegExp(this.client.token, 'gi'),
				this.client.token
					.split('.')
					.map((val, i) => (i > 1 ? val.replace(/./g, '*') : val))
					.join('.')
			);
		return cleaned;
	}
}
