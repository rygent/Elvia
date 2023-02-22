import type BaseClient from '../../../lib/BaseClient.js';
import Command from '../../../lib/structures/Interaction.js';
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { shuffleArray } from '../../../lib/utils/Function.js';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'tags unpin',
			description: 'Unpin a server tag.',
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

		const tag = prisma?.tags.find(({ slug }) => slug === name);
		if (!tag) return interaction.reply({ content: 'The tag name doesn\'t exist.', ephemeral: true });

		if (!tag.hoisted) return interaction.reply({ content: 'This tag is already unpinned.', ephemeral: true });

		await this.client.prisma.tag.update({
			where: { id: tag.id },
			data: { hoisted: false }
		});

		return interaction.reply({ content: `Tag ${inlineCode(name)} has been unpinned.`, ephemeral: true });
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
