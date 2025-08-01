import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	ComponentType,
	InteractionContextType,
	MessageFlags,
	PermissionFlagsBits
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { type AutocompleteInteraction, type ButtonInteraction, type ChatInputCommandInteraction } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { shuffleArray } from '@/lib/utils/functions.js';
import { prisma } from '@elvia/database';
import { nanoid } from 'nanoid';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'delete',
			description: 'Delete an existing server tag.',
			options: [
				{
					name: 'name',
					description: 'The tag name to delete.',
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

		const cancelId = nanoid();
		const deleteId = nanoid();
		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(new ButtonBuilder().setCustomId(cancelId).setStyle(ButtonStyle.Secondary).setLabel('Cancel'))
			.addComponents(new ButtonBuilder().setCustomId(deleteId).setStyle(ButtonStyle.Danger).setLabel('Delete'));

		const response = await interaction.reply({
			content: `Are you sure that you want to delete ${inlineCode(name)}?`,
			components: [button],
			flags: MessageFlags.Ephemeral,
			withResponse: true
		});

		const reply = response.resource?.message;
		if (!reply?.inGuild()) return;

		const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({
			filter,
			componentType: ComponentType.Button,
			time: 6e4,
			max: 1
		});

		collector.on('ignore', (i) => void i.deferUpdate());
		collector.on('collect', async (i) => {
			switch (i.customId) {
				case cancelId:
					collector.stop();
					return void i.update({ content: 'Cancelation of the deletion.', components: [] });
				case deleteId:
					await prisma.tag.delete({ where: { id: tag.id } });

					return void i.update({ content: `Successfully deleted the tag ${inlineCode(name)}.`, components: [] });
			}
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return interaction.deleteReply();
			}
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
