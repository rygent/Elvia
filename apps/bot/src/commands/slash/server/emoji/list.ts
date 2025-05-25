import { CoreClient, CoreCommand } from '@elvia/core';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'list',
			description: 'List server emojis.',
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Utility',
			guild: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const fetched = await interaction.guild?.emojis.fetch();

		const emoji = fetched?.map((item) => item.toString());
		if (!emoji?.length) {
			return interaction.reply({ content: 'There are no emojis in this server.', flags: MessageFlags.Ephemeral });
		}

		return interaction.reply({ content: `${emoji.join(' ')}`, flags: MessageFlags.Ephemeral });
	}
}
