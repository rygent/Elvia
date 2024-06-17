import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonInteraction, ChatInputCommandInteraction, parseEmoji } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { nanoid } from 'nanoid';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'emoji rename',
			description: 'Rename a server emoji.',
			category: 'Manage',
			clientPermissions: ['ManageGuildExpressions'],
			memberPermissions: ['ManageGuildExpressions'],
			guildOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const emoji = interaction.options.getString('emoji', true);
		const name = interaction.options.getString('name', true);

		const fetched = await interaction.guild?.emojis.fetch();

		const parse = parseEmoji(emoji);
		const emojis = fetched?.get(parse?.id as string);
		if (!emojis?.guild) return interaction.reply({ content: 'This emoji not from this guild', ephemeral: true });

		const cancelId = nanoid();
		const renameId = nanoid();
		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(new ButtonBuilder().setCustomId(cancelId).setStyle(ButtonStyle.Secondary).setLabel('Cancel'))
			.addComponents(new ButtonBuilder().setCustomId(renameId).setStyle(ButtonStyle.Success).setLabel('Rename'));

		const reply = await interaction.reply({
			content: `Are you sure to rename ${inlineCode(`:${emojis?.name}:`)} ${emojis} to ${inlineCode(`:${name}:`)}?`,
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
