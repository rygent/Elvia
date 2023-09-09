import type { BaseClient } from '#lib/BaseClient.js';
import { Interaction } from '#lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default class extends Interaction {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'server emoji list',
			description: 'List server emojis.',
			category: 'Utility',
			guildOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const fetched = await interaction.guild?.emojis.fetch();

		const emoji = fetched?.map((item) => item.toString());
		if (!emoji?.length) return interaction.reply({ content: 'There are no emojis in this server.', ephemeral: true });

		return interaction.reply({ content: `${emoji.join(' ')}`, ephemeral: true });
	}
}
