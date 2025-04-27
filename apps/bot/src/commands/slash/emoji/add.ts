import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { ChatInputCommandInteraction, parseEmoji, PermissionsBitField } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';

const ImageUrlRegex = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)($|\?.*$)/;

export default class extends Command {
	public constructor(client: Client<true>) {
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
