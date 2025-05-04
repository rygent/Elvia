import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { ContainerBuilder, SeparatorBuilder, TextDisplayBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, heading, hyperlink, subtext, underline } from '@discordjs/formatters';
import axios from 'axios';

export default class extends Command {
	public constructor(client: Client<true>) {
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
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const word = interaction.options.getString('word', true);

		const response = await axios
			.get(`https://api.urbandictionary.com/v0/define?page=1&term=${encodeURIComponent(word)}`)
			.then(({ data }) => data.list.sort((a: any, b: any) => b.thumbs_up - a.thumbs_up)[0]);

		if (!response) {
			return interaction.reply({ content: 'No definition found for this word.', flags: MessageFlags.Ephemeral });
		}

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[heading(hyperlink(response.word, response.permalink), 2), `\n${response.definition}`].join('\n')
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('Urban Dictionary')}`)));

		if (response.example.length) {
			const example = new TextDisplayBuilder().setContent(
				[heading(underline('Example'), 3), response.example].join('\n')
			);

			container.spliceComponents(1, 0, example);
		}

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}
}
