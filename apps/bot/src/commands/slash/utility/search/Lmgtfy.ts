import type { BaseClient } from '#lib/BaseClient.js';
import { Interaction } from '#lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { hideLinkEmbed } from '@discordjs/formatters';

export default class extends Interaction {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'search lmgtfy',
			description: 'Let Me Google That For You.',
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
