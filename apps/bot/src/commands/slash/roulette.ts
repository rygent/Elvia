import { CoreClient, CoreCommand } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold } from '@discordjs/formatters';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'roulette',
			description: 'Get a random winner from the roulette.',
			options: [
				{
					name: 'title',
					description: 'The title of the winner.',
					type: ApplicationCommandOptionType.String,
					max_length: 500,
					required: true
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Fun',
			guild: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const title = interaction.options.getString('title', true);

		const members = await interaction.guild?.members.fetch();
		const member = members?.filter(({ user }) => !user.bot).random();

		return interaction.reply({ content: `🥇 Winner of ${bold(title)} is ${member?.user.tag}.` });
	}
}
