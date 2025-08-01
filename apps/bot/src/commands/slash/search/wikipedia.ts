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
import axios from 'axios';

export default class extends CoreCommand {
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

		const response = await axios
			.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(search)}`)
			.then(({ data }) => data)
			.catch(({ status }) => {
				if (status === 404) {
					return interaction.reply({ content: 'Nothing found for this search.', flags: MessageFlags.Ephemeral });
				}
			});

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[heading(hyperlink(response.title, response.content_urls.desktop.page), 2), response.extract].join('\n')
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('Wikipedia')}`)));

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}
}
