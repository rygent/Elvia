import { CoreCommand, type CoreClient } from '@elvia/core';
import { ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';
import { type ChatInputCommandInteraction } from 'discord.js';
import { fetcher } from '@/lib/fetcher.js';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'advice',
			description: 'Get a random advice.',
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const respond = await fetcher('https://api.adviceslip.com/advice', {
			method: 'GET'
		});

		return interaction.reply({ content: respond.slip.advice });
	}
}
