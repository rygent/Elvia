import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags,
	PermissionFlagsBits,
	TextInputStyle
} from 'discord-api-types/v10';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction, type ModalSubmitInteraction } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { slugify } from '@/lib/utils/functions.js';
import { prisma } from '@elvia/database';
import { pickRandom } from '@sapphire/utilities';
import { nanoid } from 'nanoid';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'create',
			description: 'Create a new server tag.',
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Tags',
			member_permissions: [PermissionFlagsBits.ManageGuild],
			guild_only: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const database = await prisma.guild.findUnique({
			where: { id: interaction.guildId },
			select: { tags: true }
		});

		const tips = [
			'💡 Pro tip: Use **bold**, *italic*, or ~~strikethrough~~ for emphasis.',
			'💡 Pro tip: Add inline code with `backticks` or multi-line code with ```blocks```.',
			'💡 Pro tip: Create lists using `- item` or `1. item`.',
			'💡 Pro tip: Use > for blockquotes to highlight text.',
			'💡 Pro tip: Use headers with #, ##, ### to structure text.'
		];

		const modalId = nanoid();
		const modal = new ModalBuilder()
			.setCustomId(modalId)
			.setTitle('Create a Tag')
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId(`name:${modalId}`)
						.setStyle(TextInputStyle.Short)
						.setLabel('Name')
						.setPlaceholder('E.g. rules, faq, welcome')
						.setRequired(true)
						.setMaxLength(100)
				)
			)
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId(`content:${modalId}`)
						.setStyle(TextInputStyle.Paragraph)
						.setLabel('Content')
						.setPlaceholder(pickRandom(tips))
						.setRequired(true)
						.setMaxLength(2000)
				)
			);

		await interaction.showModal(modal);

		const filter = (i: ModalSubmitInteraction) => i.customId === modalId;
		const submitted = await interaction.awaitModalSubmit({ filter, time: 9e5 }).catch(() => null);
		if (!submitted) return;

		await submitted.deferReply({ flags: MessageFlags.Ephemeral });

		const name = submitted.fields.getTextInputValue(`name:${modalId}`);
		const content = submitted.fields.getTextInputValue(`content:${modalId}`);

		const isPresent = database?.tags.some(({ slug }) => slug === slugify(name));
		if (isPresent) {
			return submitted.editReply({ content: `The tag ${inlineCode(slugify(name))} already exists.` });
		}

		const tag = await prisma.tag.create({
			data: {
				guildId: interaction.guildId,
				slug: slugify(name),
				name,
				content
			}
		});

		return submitted.editReply({ content: `Successfully created a tag ${inlineCode(tag.slug)}.` });
	}
}
