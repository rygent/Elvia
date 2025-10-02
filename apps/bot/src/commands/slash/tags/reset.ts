import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	ComponentType,
	InteractionContextType,
	MessageFlags,
	PermissionFlagsBits
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { type ButtonInteraction, type ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '@elvia/database';
import { nanoid } from 'nanoid';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'reset',
			description: 'Reset all server tags.',
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

		if (!database?.tags.length) {
			return interaction.reply({ content: 'The tags for this server is empty.', flags: MessageFlags.Ephemeral });
		}

		const buttonId = nanoid();
		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder().setCustomId(`cancel:${buttonId}`).setStyle(ButtonStyle.Secondary).setLabel('Cancel')
			)
			.addComponents(
				new ButtonBuilder().setCustomId(`reset:${buttonId}`).setStyle(ButtonStyle.Danger).setLabel('Reset')
			);

		const response = await interaction.reply({
			content: `Are you sure want to reset all tags?`,
			components: [button],
			flags: MessageFlags.Ephemeral,
			withResponse: true
		});

		const message = response.resource?.message;
		if (!message?.inGuild()) return;

		try {
			const filter = async (i: ButtonInteraction<'cached'>) => {
				if (i.user.id !== interaction.user.id) {
					await i.deferUpdate();
					return false;
				}
				return true;
			};

			const clicked = await message.awaitMessageComponent({
				componentType: ComponentType.Button,
				filter,
				time: 6e4
			});

			switch (clicked.customId) {
				case `cancel:${buttonId}`: {
					return await clicked.update({ content: 'Cancelation of the resetting.', components: [] });
				}
				case `reset:${buttonId}`:
					await prisma.tag.deleteMany({ where: { guildId: interaction.guildId } });
					return await clicked.update({
						content: 'All tags have been successfully removed from this server.',
						components: []
					});
			}
		} catch (error) {
			if (error instanceof Error && error.name === 'Error [InteractionCollectorError]') {
				return interaction.deleteReply();
			}

			throw error;
		}
	}
}
