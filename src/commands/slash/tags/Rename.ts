import type BaseClient from '../../../lib/BaseClient.js';
import Command from '../../../lib/structures/Interaction.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { InteractionType, TextInputStyle } from 'discord-api-types/v10';
import { AutocompleteInteraction, ChatInputCommandInteraction, InteractionCollector, ModalSubmitInteraction } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { shuffleArray, slugify } from '../../../lib/utils/Function.js';
import { nanoid } from 'nanoid';

export default class extends Command {
	public constructor(client: BaseClient) {
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

		const prisma = await this.client.prisma.guild.findFirst({
			where: { id: interaction.guildId },
			select: { tags: true }
		});

		const tag = prisma?.tags.find(({ slug }) => slug === name);
		if (!tag) return interaction.reply({ content: `The tag ${inlineCode(name)} doesn't exist.`, ephemeral: true });

		const modalId = nanoid();
		const modal = new ModalBuilder()
			.setCustomId(modalId)
			.setTitle('Rename a server tag')
			.setComponents(new ActionRowBuilder<TextInputBuilder>()
				.setComponents(new TextInputBuilder()
					.setCustomId('name')
					.setStyle(TextInputStyle.Short)
					.setLabel('What\'s the new name?')
					.setRequired(true)
					.setMaxLength(100)));

		await interaction.showModal(modal);

		const filter = (i: ModalSubmitInteraction) => i.customId === modalId;
		const collector = new InteractionCollector(this.client, { filter, interactionType: InteractionType.ModalSubmit, max: 1 });

		collector.on('collect', async (i) => {
			const names = i.fields.getTextInputValue('name');

			const tags = prisma?.tags.some(({ slug }) => slug === slugify(names));
			if (tags) return void i.reply({ content: `The tag ${inlineCode(slugify(names))} already exists.`, ephemeral: true });

			await this.client.prisma.tag.update({
				where: { id: tag.id },
				data: {
					slug: slugify(names),
					name: names
				 }
			});

			return void i.reply({ content: `Successfully renamed the tag ${inlineCode(name)} to ${inlineCode(slugify(names))}.`, ephemeral: true });
		});
	}

	public override async autocomplete(interaction: AutocompleteInteraction<'cached'>) {
		const focused = interaction.options.getFocused();

		const prisma = await this.client.prisma.guild.findFirst({
			where: { id: interaction.guildId },
			select: { tags: true }
		});

		const choices = prisma?.tags.filter(({ name }) => name.toLowerCase().includes(focused.toLowerCase()));
		if (!choices?.length) return interaction.respond([]);

		const respond = choices.map(({ name, slug }) => ({ name, value: slug }));

		return interaction.respond(shuffleArray(respond).slice(0, 25));
	}
}
