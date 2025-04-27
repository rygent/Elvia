import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { PermissionsBitField, type AutocompleteInteraction, type ChatInputCommandInteraction } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';
import { shuffleArray } from '@/lib/utils/functions.js';
import { prisma } from '@elvia/database';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'pin',
			description: 'Pin an existing server tag.',
			options: [
				{
					name: 'name',
					description: 'The tag name to pin.',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				}
			],
			defaultMemberPermissions: new PermissionsBitField(['ManageGuild']).bitfield.toString(),
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Tags',
			userPermissions: ['ManageGuild'],
			guild: true
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

		if (tag.hoisted) {
			return interaction.reply({
				content: `The tag ${inlineCode(name)} already pinned.`,
				flags: MessageFlags.Ephemeral
			});
		}

		const pins = database?.tags.filter(({ hoisted }) => hoisted);
		if (pins!.length >= 25) {
			return interaction.reply({ content: 'Unable to pin more than 25 tags.', flags: MessageFlags.Ephemeral });
		}

		await prisma.tag.update({
			where: { id: tag.id },
			data: { hoisted: true }
		});

		return interaction.reply({
			content: `Successfully pinned the tag ${inlineCode(name)}.`,
			flags: MessageFlags.Ephemeral
		});
	}

	public override async autocomplete(interaction: AutocompleteInteraction<'cached'>) {
		const focused = interaction.options.getFocused();

		const database = await prisma.guild.findUnique({
			where: { id: interaction.guildId },
			select: { tags: true }
		});

		const choices = database?.tags.filter(({ name }) => name.toLowerCase().includes(focused.toLowerCase()));
		if (!choices?.length) return interaction.respond([]);

		const respond = choices.filter(({ hoisted }) => !hoisted).map(({ name, slug }) => ({ name, value: slug }));

		return interaction.respond(shuffleArray(respond).slice(0, 25));
	}
}
