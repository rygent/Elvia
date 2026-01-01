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
import { bold, heading, hyperlink, subtext, underline } from '@discordjs/formatters';
import { fetcher } from '@/lib/fetcher.js';

export default class extends CoreCommand<ApplicationCommandType.ChatInput> {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'define',
			description: 'Define a word.',
			options: [
				{
					name: 'word',
					description: 'Word to define.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const word = interaction.options.getString('word', true);

		const params = new URLSearchParams();
		params.set('term', word);
		params.set('page', '1');

		const respond = await fetcher(`https://api.urbandictionary.com/v0/define?${params.toString()}`, {
			method: 'GET'
		}).then((data) => data.list.sort((a: any, b: any) => b.thumbs_up - a.thumbs_up)[0]);

		if (!respond) {
			return interaction.reply({ content: 'No definition found for this word.', flags: MessageFlags.Ephemeral });
		}

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(heading(hyperlink(respond.word, respond.permalink), 2))
			)
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(respond.definition))
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('Urban Dictionary')}`)));

		if (respond.example.length) {
			const example = new TextDisplayBuilder().setContent(
				[heading(underline('Example'), 3), respond.example].join('\n')
			);

			container.spliceComponents(2, 0, example);
		}

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}
}
