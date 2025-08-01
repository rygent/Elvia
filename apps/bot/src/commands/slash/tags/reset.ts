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

		const cancelId = nanoid();
		const resetId = nanoid();
		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(new ButtonBuilder().setCustomId(cancelId).setStyle(ButtonStyle.Secondary).setLabel('Cancel'))
			.addComponents(new ButtonBuilder().setCustomId(resetId).setStyle(ButtonStyle.Danger).setLabel('Reset'));

		const response = await interaction.reply({
			content: `Are you sure that you want to reset all server tags?`,
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
					return void i.update({ content: 'Cancelation of the resetting.', components: [] });
				case resetId:
					await prisma.tag.deleteMany({ where: { guildId: interaction.guildId } });

					return void i.update({
						content: 'All tags have been successfully removed from this server.',
						components: []
					});
			}
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}
}
