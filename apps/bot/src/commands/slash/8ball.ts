import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import { type ChatInputCommandInteraction } from 'discord.js';
import { bold, quote } from '@discordjs/formatters';
import { fetcher } from '@/lib/fetcher.js';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: '8ball',
			description: 'Ask magic 8ball.',
			options: [
				{
					name: 'question',
					description: 'Question to ask.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const question = interaction.options.getString('question', true);

		const respond = await fetcher(`https://www.eightballapi.com/api?question=${encodeURIComponent(question)}`, {
			method: 'GET'
		});

		const replies = [quote(`${bold(interaction.user.tag)}: ${question}`), `🎱 ${respond.reading}`].join('\n');

		return interaction.reply({ content: replies });
	}
}
