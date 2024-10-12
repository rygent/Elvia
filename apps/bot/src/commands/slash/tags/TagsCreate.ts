import { Client, Command } from '@elvia/tesseract';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	InteractionType,
	TextInputStyle
} from 'discord-api-types/v10';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import {
	ChatInputCommandInteraction,
	InteractionCollector,
	ModalSubmitInteraction,
	PermissionsBitField
} from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { slugify } from '@/lib/utils/Functions.js';
import { prisma } from '@elvia/database';
import { nanoid } from 'nanoid';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'create',
			description: 'Create a new server tag.',
			defaultMemberPermissions: new PermissionsBitField(['ManageGuild']).bitfield.toString(),
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Tags',
			userPermissions: ['ManageGuild'],
			guild: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const database = await prisma.guild.findUnique({
			where: { guildId: interaction.guildId },
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
