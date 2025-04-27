import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { AttachmentBuilder, ChatInputCommandInteraction, parseEmoji } from 'discord.js';

export default class extends Command {
	public constructor(client: Client<true>) {
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
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Utility',
			guild: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const emoji = interaction.options.getString('emoji', true);

		const fetched = await interaction.guild?.emojis.fetch();

		const emojis = fetched?.get(parseEmoji(emoji)?.id as string);
		if (!emojis?.guild) {
			return interaction.reply({ content: 'This emoji not from this guild', flags: MessageFlags.Ephemeral });
		}

		const attachment = new AttachmentBuilder(emojis.url).setName(`${emojis.name}.${emojis.animated ? 'gif' : 'png'}`);

		return interaction.reply({ files: [attachment] });
	}
}
