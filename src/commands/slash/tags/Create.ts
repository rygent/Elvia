import type BaseClient from '../../../lib/BaseClient.js';
import Command from '../../../lib/structures/Interaction.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { InteractionType, TextInputStyle } from 'discord-api-types/v10';
import { ChatInputCommandInteraction, InteractionCollector, ModalSubmitInteraction } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { slugify } from '../../../lib/utils/Function.js';
import { prisma } from '../../../lib/utils/Prisma.js';
import { nanoid } from 'nanoid';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'tags create',
			description: 'Create a new server tag.',
			category: 'Tags',
			memberPermissions: ['ManageGuild'],
			guildOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const database = await prisma.guild.findFirst({
			where: { id: interaction.guildId },
			select: { tags: true }
		});

		const modalId = nanoid();
		const modal = new ModalBuilder()
			.setCustomId(modalId)
			.setTitle('Create a new server tag')
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId('name')
						.setStyle(TextInputStyle.Short)
						.setLabel("What's the name?")
						.setRequired(true)
						.setMaxLength(100)
				)
			)
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId('content')
						.setStyle(TextInputStyle.Paragraph)
						.setLabel("What's the content?")
						.setPlaceholder('PRO TIP: can use discord markdown syntax.')
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
			const names = i.fields.getTextInputValue('name');
			const content = i.fields.getTextInputValue('content');

			const tags = database?.tags.some(({ slug }) => slug === slugify(names));
			if (tags) {
				return void i.reply({ content: `The tag ${inlineCode(slugify(names))} already exists.`, ephemeral: true });
			}

			await prisma.tag.create({
				data: {
					guildId: interaction.guildId,
					slug: slugify(names),
					name: names,
					content
				}
			});

			return void i.reply({
				content: `Successfully created a new server tag ${inlineCode(slugify(names))}.`,
				ephemeral: true
			});
		});
	}
}
