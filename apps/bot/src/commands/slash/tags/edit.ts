import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags,
	PermissionFlagsBits,
	TextInputStyle
} from 'discord-api-types/v10';
import { LabelBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	type ModalSubmitInteraction
} from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { slugify } from '@/lib/utils/functions.js';
import { prisma } from '@elvia/database';
import { pickRandom } from '@sapphire/utilities';
import { nanoid } from 'nanoid';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'edit',
			description: 'Edit an existing server tag.',
			options: [
				{
					name: 'name',
					description: 'The tag name to edit.',
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
			.setTitle('Edit Tag')
			.addLabelComponents(
				new LabelBuilder()
					.setLabel('Name')
					.setDescription('A short, unique name to identify the tag.')
					.setTextInputComponent(
						new TextInputBuilder()
							.setCustomId(`name:${modalId}`)
							.setStyle(TextInputStyle.Short)
							.setPlaceholder('e.g. rules, faq, welcome')
							.setValue(tag.name)
							.setMaxLength(100)
							.setRequired()
					)
			)
			.addLabelComponents(
				new LabelBuilder()
					.setLabel('Content')
					.setDescription('The message that appears when the tag is used.')
					.setTextInputComponent(
						new TextInputBuilder()
							.setCustomId(`content:${modalId}`)
							.setStyle(TextInputStyle.Paragraph)
							.setPlaceholder(pickRandom(tips))
							.setValue(tag.content)
							.setMaxLength(2000)
							.setRequired()
					)
			);

		await interaction.showModal(modal);

		const filter = (i: ModalSubmitInteraction) => i.customId === modalId;
		const submitted = await interaction.awaitModalSubmit({ filter, time: 9e5 }).catch(() => null);
		if (!submitted) return;

		await submitted.deferReply({ flags: MessageFlags.Ephemeral });

		const editedName = submitted.fields.getTextInputValue(`name:${modalId}`);
		const editedContent = submitted.fields.getTextInputValue(`content:${modalId}`);

		const isPresent = database?.tags.some(({ slug }) => slug === slugify(editedName));
		if (editedName !== tag.name && isPresent) {
			return submitted.editReply({ content: `The tag ${inlineCode(slugify(editedName))} already exists.` });
		}

		const updated = await prisma.tag.update({
			where: { id: tag.id },
			data: {
				content: editedContent,
				...(editedName !== tag.name && { slug: slugify(editedName), name: editedName })
			}
		});

		return submitted.editReply({ content: `Successfully edited the tag ${inlineCode(updated.slug)}.` });
	}

	public override async autocomplete(interaction: AutocompleteInteraction<'cached'>) {
		const focused = interaction.options.getFocused();

		const database = await prisma.guild.findUnique({
			where: { id: interaction.guildId },
			select: { tags: true }
		});

		const options = database?.tags.filter(({ name }) => name.toLowerCase().includes(focused.toLowerCase()));
		if (!options?.length) return interaction.respond([]);

		const respond = options.map(({ name, slug }) => ({ name, value: slug })).slice(0, 25);

		return interaction.respond(respond);
	}
}
