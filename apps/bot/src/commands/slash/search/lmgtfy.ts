import { CoreClient, CoreCommand } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';
import { hideLinkEmbed } from '@discordjs/formatters';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'lmgtfy',
			description: 'Let Me Google That For You.',
			options: [
				{
					name: 'search',
					description: 'Your search.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		return interaction.reply({
			content: hideLinkEmbed(`https://letmegooglethat.com/?q=${encodeURIComponent(search)}`)
		});
	}
}
