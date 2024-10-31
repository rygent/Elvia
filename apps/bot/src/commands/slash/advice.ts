import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import { ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';
import axios from 'axios';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'advice',
			description: 'Get a random advice.',
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const response = await axios.get('https://api.adviceslip.com/advice').then(({ data }) => data);

		return interaction.reply({ content: response.slip.advice });
	}
}
