import type BaseClient from '../../../lib/BaseClient.js';
import Command from '../../../lib/structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import type { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { shuffleArray } from '../../../lib/utils/Function.js';
import { nanoid } from 'nanoid';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'tags delete',
			description: 'Delete a server tag.',
			category: 'Tags',
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

		const cancelId = nanoid();
		const deleteId = nanoid();
		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(new ButtonBuilder()
				.setCustomId(cancelId)
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Cancel'))
			.addComponents(new ButtonBuilder()
				.setCustomId(deleteId)
				.setStyle(ButtonStyle.Danger)
				.setLabel('Delete'));

		const reply = await interaction.reply({ content: `Are you sure that you want to delete ${inlineCode(name)}?`, components: [button], ephemeral: true });

		const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 6e4, max: 1 });

		collector.on('ignore', (i) => void i.deferUpdate());
		collector.on('collect', async (i) => {
			switch (i.customId) {
				case cancelId:
					collector.stop();
					return void i.update({ content: 'Cancelation of the deletion.', components: [] });
				case deleteId:
					await this.client.prisma.tag.delete({ where: { id: filtered.id } });

					return void i.update({ content: `Tag ${inlineCode(name)} has been deleted.`, components: [] });
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
