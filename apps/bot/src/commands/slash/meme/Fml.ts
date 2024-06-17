import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { UserAgent } from '@/lib/utils/Constants.js';
import { request } from 'undici';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'meme fml',
			description: 'Get a random F My Life story.',
			category: 'Meme'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const language = interaction.options.getString('language') ?? 'en';

		const raw = await request(`https://blague.xyz/api/vdm/random?lang=${language}`, {
			method: 'GET',
			headers: { 'User-Agent': UserAgent },
			maxRedirections: 20
		});

		const response: any = await raw.body.json();

		return interaction.reply({ content: response.vdm.content });
	}
}
