import { Client, Command } from '@elvia/tesseract';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	ComponentType,
	InteractionContextType
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { PermissionsBitField, type ButtonInteraction, type ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '@elvia/database';
import { nanoid } from 'nanoid';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'reset',
			description: 'Reset all server tags.',
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

		if (!database?.tags.length) {
			return interaction.reply({ content: 'The tags for this server is empty.', ephemeral: true });
		}

		const cancelId = nanoid();
		const resetId = nanoid();
		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(new ButtonBuilder().setCustomId(cancelId).setStyle(ButtonStyle.Secondary).setLabel('Cancel'))
			.addComponents(new ButtonBuilder().setCustomId(resetId).setStyle(ButtonStyle.Danger).setLabel('Reset'));

		const reply = await interaction.reply({
			content: `Are you sure that you want to reset all server tags?`,
			components: [button],
			ephemeral: true
		});

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
