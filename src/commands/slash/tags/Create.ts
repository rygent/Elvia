import type BaseClient from '../../../lib/BaseClient.js';
import Command from '../../../lib/structures/Interaction.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { InteractionType, TextInputStyle } from 'discord-api-types/v10';
import { ChatInputCommandInteraction, InteractionCollector, ModalSubmitInteraction } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { slugify } from '../../../lib/utils/Function.js';
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
		const prisma = await this.client.prisma.guild.findFirst({
			where: { id: interaction.guildId },
			select: { tags: true }
		});

		const modalId = nanoid();
		const modal = new ModalBuilder()
			.setCustomId(modalId)
			.setTitle('Create a new server tag')
			.addComponents(new ActionRowBuilder<TextInputBuilder>()
				.setComponents(new TextInputBuilder()
					.setCustomId('title')
					.setStyle(TextInputStyle.Short)
					.setLabel('Title')
					.setRequired(true)
					.setMaxLength(100)))
			.addComponents(new ActionRowBuilder<TextInputBuilder>()
				.setComponents(new TextInputBuilder()
					.setCustomId('content')
					.setStyle(TextInputStyle.Paragraph)
					.setLabel('Content')
					.setRequired(true)
					.setMaxLength(2000)));

		await interaction.showModal(modal);

		const filter = (i: ModalSubmitInteraction) => i.customId === modalId;
		const collector = new InteractionCollector(this.client, { filter, interactionType: InteractionType.ModalSubmit, max: 1 });

		collector.on('collect', async (i) => {
			const title = i.fields.getTextInputValue('title');
			const content = i.fields.getTextInputValue('content');

			const exist = prisma?.tags.some(({ slug }) => slug === slugify(title));
			if (exist) return void i.reply({ content: 'A tag with that name already exists.', ephemeral: true });

			await this.client.prisma.tag.create({
				data: {
					guildId: interaction.guildId,
					slug: slugify(title),
					name: title,
					content
				}
			});

			return void i.reply({ content: `Tag ${inlineCode(slugify(title))} has been created.`, ephemeral: true });
		});
	}
}
