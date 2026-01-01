import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags,
	PermissionFlagsBits
} from 'discord-api-types/v10';
import { parseEmoji, type ChatInputCommandInteraction } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';

const ImageUrlRegex = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)($|\?.*$)/;

export default class extends CoreCommand<ApplicationCommandType.ChatInput> {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'add',
			description: 'Add an emoji to the server.',
			options: [
				{
					name: 'name',
					description: 'The name of the emoji.',
					type: ApplicationCommandOptionType.String,
					min_length: 2,
					max_length: 32,
					required: true
				},
				{
					name: 'emoji',
					description: 'The emoji to add. (Can be an existing emoji or a link)',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Manage',
			client_permissions: [PermissionFlagsBits.ManageGuildExpressions],
			member_permissions: [PermissionFlagsBits.ManageGuildExpressions],
			guild_only: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const name = interaction.options.getString('name', true);
		let emoji = interaction.options.getString('emoji', true);

		try {
			if (!ImageUrlRegex.test(emoji)) {
				const parse = parseEmoji(emoji);
				emoji = `https://cdn.discordapp.com/emojis/${parse?.id}.${parse?.animated ? 'gif' : 'png'}`;
			}

			const emojis = await interaction.guild?.emojis.create({ attachment: emoji, name });

			return await interaction.reply({
				content: `Emoji ${inlineCode(`:${emojis?.name}:`)} ${emojis} was successfully added.`
			});
		} catch {
			return interaction.reply({
				content: "The emoji are invalid or you don't have more space on your server!",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}
