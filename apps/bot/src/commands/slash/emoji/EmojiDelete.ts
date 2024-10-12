import { Client, Command } from '@elvia/tesseract';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	ComponentType,
	InteractionContextType
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonInteraction, ChatInputCommandInteraction, parseEmoji, PermissionsBitField } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { nanoid } from 'nanoid';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'delete',
			description: 'Delete a server emoji.',
			options: [
				{
					name: 'emoji',
					description: 'The emoji to delete.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			defaultMemberPermissions: new PermissionsBitField(['ManageGuildExpressions']).bitfield.toString(),
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Manage',
			clientPermissions: ['ManageGuildExpressions'],
			userPermissions: ['ManageGuildExpressions'],
			guild: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const emoji = interaction.options.getString('emoji', true);

		const fetched = await interaction.guild?.emojis.fetch();

		const parse = parseEmoji(emoji);
		const emojis = fetched?.get(parse?.id as string);
		if (!emojis?.guild) return interaction.reply({ content: 'This emoji not from this guild', ephemeral: true });

		const cancelId = nanoid();
		const deleteId = nanoid();
		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(new ButtonBuilder().setCustomId(cancelId).setStyle(ButtonStyle.Secondary).setLabel('Cancel'))
			.addComponents(new ButtonBuilder().setCustomId(deleteId).setStyle(ButtonStyle.Danger).setLabel('Delete'));

		const reply = await interaction.reply({
			content: `Are you sure that you want to delete the ${inlineCode(`:${emojis?.name}:`)} ${emojis} emoji?`,
			components: [button]
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
					return void i.update({ content: 'Cancelation of the deletion of the emoji.', components: [] });
				case deleteId:
					await emojis.delete();
					return void i.update({
						content: `Emoji ${inlineCode(`:${emojis?.name}:`)} was successfully removed.`,
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
