import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import { InteractionType, TextInputStyle } from 'discord-api-types/v10';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	InteractionCollector,
	ModalSubmitInteraction
} from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { shuffleArray, slugify } from '@/lib/utils/Functions.js';
import { prisma } from '@elvia/database';
import { nanoid } from 'nanoid';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'tags rename',
			description: 'Rename an existing server tag.',
			category: 'Tags',
			memberPermissions: ['ManageGuild'],
			guildOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const name = interaction.options.getString('name', true);

		const database = await prisma.guild.findUnique({
			where: { guildId: interaction.guildId },
			select: { tags: true }
		});

		const tag = database?.tags.find(({ slug }) => slug === name);
		if (!tag) return interaction.reply({ content: `The tag ${inlineCode(name)} doesn't exist.`, ephemeral: true });

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
				return void i.reply({ content: `The tag ${inlineCode(slugify(names))} already exists.`, ephemeral: true });
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
				ephemeral: true
			});
		});
	}

	public override async autocomplete(interaction: AutocompleteInteraction<'cached'>) {
		const focused = interaction.options.getFocused();

		const database = await prisma.guild.findUnique({
			where: { guildId: interaction.guildId },
			select: { tags: true }
		});

		const choices = database?.tags.filter(({ name }) => name.toLowerCase().includes(focused.toLowerCase()));
		if (!choices?.length) return interaction.respond([]);

		const respond = choices.map(({ name, slug }) => ({ name, value: slug }));

		return interaction.respond(shuffleArray(respond).slice(0, 25));
	}
}
