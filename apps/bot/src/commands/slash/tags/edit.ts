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
import { shuffleArray } from '@/lib/utils/functions.js';
import { prisma } from '@elvia/database';
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

		const modalId = nanoid();
		const modal = new ModalBuilder()
			.setCustomId(modalId)
			.setTitle('Edit a server tag')
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId('content')
						.setStyle(TextInputStyle.Paragraph)
						.setLabel("What's the new content?")
						.setPlaceholder('PRO TIP: can use discord markdown syntax.')
						.setValue(tag.content)
						.setRequired(true)
						.setMaxLength(2000)
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
			const content = i.fields.getTextInputValue('content');

			await prisma.tag.update({
				where: { id: tag.id },
				data: { content }
			});

			return void i.reply({
				content: `Successfully edited the tag ${inlineCode(name)}.`,
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
