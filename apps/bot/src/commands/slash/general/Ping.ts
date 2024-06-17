import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, inlineCode, italic } from '@discordjs/formatters';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'ping',
			description: 'Send a ping request.',
			category: 'General'
		});
	}

	public execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const replies = [
			`${bold(italic('Websocket:'))} ${inlineCode(`${Math.round(this.client.ws.ping)}ms`)}`,
			`${bold(italic('Latency:'))} ${inlineCode(`${Math.round(Date.now() - interaction.createdTimestamp)}ms`)}`
		].join('\n');

		return interaction.reply({ content: replies });
	}
}
