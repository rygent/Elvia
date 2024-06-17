import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, quote } from '@discordjs/formatters';
import { UserAgent } from '@/lib/utils/Constants.js';
import { request } from 'undici';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: '8ball',
			description: 'Ask magic 8ball.',
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const question = interaction.options.getString('question', true);

		const raw = await request(`https://eightballapi.com/api?question=${encodeURIComponent(question)}`, {
			method: 'GET',
			headers: { 'User-Agent': UserAgent },
			maxRedirections: 20
		});

		const response: any = await raw.body.json();

		const replies = [quote(`${bold(interaction.user.tag)}: ${question}`), `🎱 ${response.reading}`].join('\n');

		return interaction.reply({ content: replies });
	}
}
