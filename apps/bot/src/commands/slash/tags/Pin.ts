import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { shuffleArray } from '@/lib/utils/Functions.js';
import { prisma } from '@elvia/database';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'tags pin',
			description: 'Pin an existing server tag.',
			category: 'Tags',
			memberPermissions: ['ManageGuild'],
			guildOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const name = interaction.options.getString('name', true);

		const database = await prisma.guild.findUnique({
			where: { guildId: interaction.guildId },
			select: { tags: true }
		});

		const tag = database?.tags.find(({ slug }) => slug === name);
		if (!tag) return interaction.reply({ content: `The tag ${inlineCode(name)} doesn't exist.`, ephemeral: true });

		if (tag.hoisted) {
			return interaction.reply({ content: `The tag ${inlineCode(name)} already pinned.`, ephemeral: true });
		}

		const pins = database?.tags.filter(({ hoisted }) => hoisted);
		if (pins!.length >= 25) return interaction.reply({ content: 'Unable to pin more than 25 tags.', ephemeral: true });

		await prisma.tag.update({
			where: { id: tag.id },
			data: { hoisted: true }
		});

		return interaction.reply({ content: `Successfully pinned the tag ${inlineCode(name)}.`, ephemeral: true });
	}

	public override async autocomplete(interaction: AutocompleteInteraction<'cached'>) {
		const focused = interaction.options.getFocused();

		const database = await prisma.guild.findUnique({
			where: { guildId: interaction.guildId },
			select: { tags: true }
		});

		const choices = database?.tags.filter(({ name }) => name.toLowerCase().includes(focused.toLowerCase()));
		if (!choices?.length) return interaction.respond([]);

		const respond = choices.filter(({ hoisted }) => !hoisted).map(({ name, slug }) => ({ name, value: slug }));

		return interaction.respond(shuffleArray(respond).slice(0, 25));
	}
}
