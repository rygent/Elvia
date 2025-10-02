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

		const buttonId = nanoid();
		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder().setCustomId(`cancel:${buttonId}`).setStyle(ButtonStyle.Secondary).setLabel('Cancel')
			)
			.addComponents(
				new ButtonBuilder().setCustomId(`delete:${buttonId}`).setStyle(ButtonStyle.Danger).setLabel('Delete')
			);

		const response = await interaction.reply({
			content: `Are you sure want to delete ${inlineCode(name)}?`,
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
					return await clicked.update({ content: 'Cancelation of the deletion.', components: [] });
				}
				case `delete:${buttonId}`:
					await prisma.tag.delete({ where: { id: tag.id } });
					return await clicked.update({
						content: `Successfully deleted the tag ${inlineCode(name)}.`,
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

	public override async autocomplete(interaction: AutocompleteInteraction<'cached'>) {
		const focused = interaction.options.getFocused();

		const database = await prisma.guild.findUnique({
			where: { id: interaction.guildId },
			select: { tags: true }
		});

		const options = database?.tags.filter(({ name }) => name.toLowerCase().includes(focused.toLowerCase()));
		if (!options?.length) return interaction.respond([]);

		const respond = options.map(({ name, slug }) => ({ name, value: slug })).slice(0, 25);

		return interaction.respond(respond);
	}
}
