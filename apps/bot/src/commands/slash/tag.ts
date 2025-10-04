import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { type AutocompleteInteraction, type ChatInputCommandInteraction } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { prisma } from '@elvia/database';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'tag',
			description: 'Send an existing server tag.',
			options: [
				{
					name: 'name',
					description: 'The tag name to get.',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Tags',
			guild_only: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const name = interaction.options.getString('name', true);

		const database = await prisma.guild.findUnique({
			where: { id: interaction.guildId },
			select: { tags: true }
		});

		const tag = database?.tags.find(({ slug }) => slug === name);
		if (!tag) {
			return interaction.reply({
				content: `The tag ${inlineCode(name)} doesn't exist.`,
				flags: MessageFlags.Ephemeral
			});
		}

		return interaction.reply({ content: tag.content });
	}

	public override async autocomplete(interaction: AutocompleteInteraction<'cached'>) {
		const focused = interaction.options.getFocused();

		const database = await prisma.guild.findUnique({
			where: { id: interaction.guildId },
			select: { tags: true }
		});

		const choices = database?.tags.filter(({ name }) => name.toLowerCase().includes(focused.value.toLowerCase()));
		if (!choices?.length) return interaction.respond([]);

		let respond = choices.filter(({ hoisted }) => hoisted).map(({ name, slug }) => ({ name, value: slug }));

		if (focused.value.length) {
			respond = choices.map(({ name, slug }) => ({ name, value: slug }));

			return interaction.respond(respond.slice(0, 25));
		}

		return interaction.respond(respond.slice(0, 25));
	}
}
