import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { UserAgent } from '@/lib/utils/Constants.js';
import { request } from 'undici';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'advice',
			description: 'Get a random advice.',
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const raw = await request('https://api.adviceslip.com/advice', {
			method: 'GET',
			headers: { 'User-Agent': UserAgent },
			maxRedirections: 20
		});

		const response: any = await raw.body.json();

		return interaction.reply({ content: response.slip.advice });
	}
}
