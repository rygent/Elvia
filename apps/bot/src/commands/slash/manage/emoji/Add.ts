import type { BaseClient } from '#lib/structures/BaseClient.js';
import { Interaction } from '#lib/structures/Interaction.js';
import { ChatInputCommandInteraction, parseEmoji } from 'discord.js';
import { inlineCode } from '@discordjs/formatters';

const ImageUrlRegex = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)($|\?.*$)/;

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'emoji add',
			description: 'Add an emoji to the server.',
			category: 'Manage',
			clientPermissions: ['ManageGuildExpressions'],
			memberPermissions: ['ManageGuildExpressions'],
			guildOnly: true
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
				ephemeral: true
			});
		}
	}
}
