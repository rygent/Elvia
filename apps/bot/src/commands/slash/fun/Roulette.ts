import type { BaseClient } from '#lib/BaseClient.js';
import { Interaction } from '#lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold } from '@discordjs/formatters';

export default class extends Interaction {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'roulette',
			description: 'Get a random winner from the roulette.',
			category: 'Fun',
			guildOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const title = interaction.options.getString('title', true);

		const members = await interaction.guild?.members.fetch();
		const member = members?.filter(({ user }) => !user.bot).random();

		return interaction.reply({ content: `🥇 Winner of ${bold(title)} is ${member?.user.tag}.` });
	}
}
