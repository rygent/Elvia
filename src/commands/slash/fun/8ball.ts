import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, quote } from '@discordjs/formatters';
import { Env } from '#lib/utils/Env.js';
import { request } from 'undici';

export default class extends Command {
	public constructor(client: BaseClient) {
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
			headers: { 'User-Agent': Env.UserAgent },
			maxRedirections: 20
		});

		const response = await raw.body.json();

		const replies = [quote(`${bold(interaction.user.username)}: ${question}`), `🎱 ${response.reading}`].join('\n');

		return interaction.reply({ content: replies });
	}
}
