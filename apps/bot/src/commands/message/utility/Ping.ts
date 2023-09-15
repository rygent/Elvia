import type { BaseClient } from '#lib/structures/BaseClient.js';
import { Command } from '#lib/structures/Command.js';
import type { Message } from 'discord.js';
import { bold, inlineCode, italic } from '@discordjs/formatters';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'ping',
			aliases: ['pong'],
			description: 'Send a ping request.',
			category: 'Utility',
			disabled: true
		});
	}

	public async execute(message: Message<false>) {
		const replies = [
			`${bold(italic('Websocket:'))} ${inlineCode(`${Math.round(this.client.ws.ping)}ms`)}`,
			`${bold(italic('Latency:'))} ${inlineCode(`${Math.round(Date.now() - message.createdTimestamp)}ms`)}`
		].join('\n');

		return message.reply({ content: replies });
	}
}
