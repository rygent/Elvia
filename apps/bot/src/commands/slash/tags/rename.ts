import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	InteractionType,
	MessageFlags,
	PermissionFlagsBits,
	TextInputStyle
} from 'discord-api-types/v10';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import {
	InteractionCollector,
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	type ModalSubmitInteraction
} from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { shuffleArray, slugify } from '@/lib/utils/functions.js';
import { prisma } from '@elvia/database';
import { nanoid } from 'nanoid';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'rename',
			description: 'Rename an existing server tag.',
			options: [
				{
					name: 'name',
					description: 'The tag name to rename.',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Tags',
			member_permissions: [PermissionFlagsBits.ManageGuild],
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

		const modalId = nanoid();
		const modal = new ModalBuilder()
			.setCustomId(modalId)
			.setTitle('Rename a server tag')
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId('name')
						.setStyle(TextInputStyle.Short)
						.setLabel("What's the new name?")
						.setRequired(true)
						.setMaxLength(100)
				)
			);

		await interaction.showModal(modal);

		const filter = (i: ModalSubmitInteraction) => i.customId === modalId;
		const collector = new InteractionCollector(this.client, {
			filter,
			interactionType: InteractionType.ModalSubmit,
			max: 1
		});

		collector.on('collect', async (i) => {
			const names = i.fields.getTextInputValue('name');

			const tags = database?.tags.some(({ slug }) => slug === slugify(names));
			if (tags) {
				return void i.reply({
					content: `The tag ${inlineCode(slugify(names))} already exists.`,
					flags: MessageFlags.Ephemeral
				});
			}

			await prisma.tag.update({
				where: { id: tag.id },
				data: {
					slug: slugify(names),
					name: names
				}
			});

			return void i.reply({
				content: `Successfully renamed the tag ${inlineCode(name)} to ${inlineCode(slugify(names))}.`,
				flags: MessageFlags.Ephemeral
			});
		});
	}

	public override async autocomplete(interaction: AutocompleteInteraction<'cached'>) {
		const focused = interaction.options.getFocused();

		const database = await prisma.guild.findUnique({
			where: { id: interaction.guildId },
			select: { tags: true }
		});

		const choices = database?.tags.filter(({ name }) => name.toLowerCase().includes(focused.toLowerCase()));
		if (!choices?.length) return interaction.respond([]);

		const respond = choices.map(({ name, slug }) => ({ name, value: slug }));

		return interaction.respond(shuffleArray(respond).slice(0, 25));
	}
}
