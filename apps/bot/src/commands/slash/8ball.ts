import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import { type ChatInputCommandInteraction } from 'discord.js';
import { bold, quote } from '@discordjs/formatters';
import axios from 'axios';

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

		const response = await axios
			.get(`https://eightballapi.com/api?question=${encodeURIComponent(question)}`)
			.then(({ data }) => data);

		const replies = [quote(`${bold(interaction.user.tag)}: ${question}`), `🎱 ${response.reading}`].join('\n');

		return interaction.reply({ content: replies });
	}
}
