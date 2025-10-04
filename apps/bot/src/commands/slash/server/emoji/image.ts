import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { AttachmentBuilder, parseEmoji, type ChatInputCommandInteraction } from 'discord.js';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'image',
			description: 'Get the full size image of an emoji.',
			options: [
				{
					name: 'emoji',
					description: 'The emoji to get.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Utility',
			guild_only: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const emoji = interaction.options.getString('emoji', true);

		const fetched = await interaction.guild?.emojis.fetch();

		const emojis = fetched?.get(parseEmoji(emoji)?.id as string);
		if (!emojis?.guild) {
			return interaction.reply({ content: 'This emoji not from this guild', flags: MessageFlags.Ephemeral });
		}

		const attachment = new AttachmentBuilder(emojis.imageURL({ size: 4096 })).setName(
			`${emojis.name}.${emojis.animated ? 'gif' : 'png'}`
		);

		return interaction.reply({ files: [attachment] });
	}
}
