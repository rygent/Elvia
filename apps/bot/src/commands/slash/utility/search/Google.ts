import type { BaseClient } from '#lib/structures/BaseClient.js';
import { Interaction } from '#lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { hideLinkEmbed } from '@discordjs/formatters';

export default class extends Interaction {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'search google',
			description: 'Search for something on Google.',
			category: 'Utility'
		});
	}

	public execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		return interaction.reply({
			content: hideLinkEmbed(`https://www.google.com/search?q=${encodeURIComponent(search)}`)
		});
	}
}
