import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { ContainerBuilder, SeparatorBuilder, TextDisplayBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction } from 'discord.js';
import { bold, heading, hyperlink, subtext } from '@discordjs/formatters';
import { UndiciError, fetcher } from '@/lib/fetcher.js';

export default class extends CoreCommand<ApplicationCommandType.ChatInput> {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'wikipedia',
			description: 'Search for something on Wikipedia.',
			options: [
				{
					name: 'search',
					description: 'Your search.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		try {
			const respond = await fetcher(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(search)}`, {
				method: 'GET'
			});

			const container = new ContainerBuilder()
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(heading(hyperlink(respond.title, respond.content_urls.desktop.page), 2))
				)
				.addTextDisplayComponents(new TextDisplayBuilder().setContent(respond.extract))
				.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
				.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('Wikipedia')}`)));

			return await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
		} catch (error) {
			if (error instanceof UndiciError) {
				if (error.statusCode === 404) {
					return interaction.reply({ content: 'Nothing found for this search.', flags: MessageFlags.Ephemeral });
				}
			}

			throw error;
		}
	}
}
