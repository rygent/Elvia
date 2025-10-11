import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import { type ChatInputCommandInteraction } from 'discord.js';
import { fetcher } from '@/lib/fetcher.js';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'fml',
			description: 'Get a random F My Life story.',
			options: [
				{
					name: 'language',
					description: 'Optional language of the story.',
					type: ApplicationCommandOptionType.String,
					choices: [
						{
							name: 'English',
							value: 'en'
						},
						{
							name: 'Français',
							value: 'fr'
						}
					],
					required: false
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Meme'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const language = interaction.options.getString('language') ?? 'en';

		const respond = await fetcher(`https://blague.xyz/api/vdm/random?lang=${language}`, {
			method: 'GET'
		});

		return interaction.reply({ content: respond.vdm.content });
	}
}
