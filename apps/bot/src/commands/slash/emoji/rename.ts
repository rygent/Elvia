import { CoreClient, CoreCommand } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ComponentType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { ActionRowBuilder, SecondaryButtonBuilder, SuccessButtonBuilder } from '@discordjs/builders';
import { ButtonInteraction, ChatInputCommandInteraction, parseEmoji, PermissionsBitField } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { nanoid } from 'nanoid';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'rename',
			description: 'Rename a server emoji.',
			options: [
				{
					name: 'emoji',
					description: 'The emoji to rename.',
					type: ApplicationCommandOptionType.String,
					required: true
				},
				{
					name: 'name',
					description: 'The new name of the emoji.',
					type: ApplicationCommandOptionType.String,
					min_length: 2,
					max_length: 32,
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
		const name = interaction.options.getString('name', true);

		const fetched = await interaction.guild?.emojis.fetch();

		const parse = parseEmoji(emoji);
		const emojis = fetched?.get(parse?.id as string);
		if (!emojis?.guild) {
			return interaction.reply({ content: 'This emoji not from this guild', flags: MessageFlags.Ephemeral });
		}

		const cancelId = nanoid();
		const renameId = nanoid();
		const button = new ActionRowBuilder()
			.addSecondaryButtonComponents(new SecondaryButtonBuilder().setCustomId(cancelId).setLabel('Cancel'))
			.addSuccessButtonComponents(new SuccessButtonBuilder().setCustomId(renameId).setLabel('Rename'));

		const response = await interaction.reply({
			content: `Are you sure to rename ${inlineCode(`:${emojis?.name}:`)} ${emojis} to ${inlineCode(`:${name}:`)}?`,
			components: [button],
			withResponse: true
		});

		const message = response.resource?.message;
		if (!message?.inGuild()) return;

		const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
		const collector = message.createMessageComponentCollector({
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
					return void i.update({ content: "Cancelation of the emoji's name change.", components: [] });
				case renameId:
					await emojis.edit({ name });
					return void i.update({
						content: `Emoji ${inlineCode(`:${emojis?.name}:`)} was successfully renamed.`,
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
