import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { Advances } from '#lib/utils/Constants.js';
import { request } from 'undici';

export default class extends Command {
	public constructor(client: BaseClient) {
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
			headers: { 'User-Agent': Advances.UserAgent },
			maxRedirections: 20
		});

		const response = await raw.body.json();

		return interaction.reply({ content: response.vdm.content });
	}
}
