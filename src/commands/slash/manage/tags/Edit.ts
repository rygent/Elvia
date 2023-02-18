import type BaseClient from '../../../../lib/BaseClient.js';
import Command from '../../../../lib/structures/Interaction.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { InteractionType, TextInputStyle } from 'discord-api-types/v10';
import { AutocompleteInteraction, ChatInputCommandInteraction, InteractionCollector, ModalSubmitInteraction } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { shuffleArray } from '../../../../lib/utils/Function.js';
import { nanoid } from 'nanoid';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'tags edit',
			description: 'Edit a server tag.',
			category: 'Manage',
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

		const filtered = prisma?.tags.find(({ slug }) => slug === name);
		if (!filtered) return interaction.reply({ content: 'The tag name doesn\'t exist.', ephemeral: true });

		const modalId = nanoid();
		const modal = new ModalBuilder()
			.setCustomId(modalId)
			.setTitle('Edit a server tag')
			.setComponents(new ActionRowBuilder<TextInputBuilder>()
				.setComponents(new TextInputBuilder()
					.setCustomId('content')
					.setStyle(TextInputStyle.Paragraph)
					.setLabel('Content')
					.setValue(filtered.content)
					.setRequired(true)
					.setMaxLength(2000)));

		await interaction.showModal(modal);

		const filter = (i: ModalSubmitInteraction) => i.customId === modalId;
		const collector = new InteractionCollector(this.client, { filter, interactionType: InteractionType.ModalSubmit, max: 1 });

		collector.on('collect', async (i) => {
			const content = i.fields.getTextInputValue('content');

			await this.client.prisma.tag.update({
				where: { id: filtered.id },
				data: { content }
			});

			return void i.reply({ content: `Tag ${inlineCode(name)} has been edited.`, ephemeral: true });
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

		return interaction.respond(shuffleArray(respond.slice(0, 25)));
	}
}
