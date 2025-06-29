import { CoreClient, CoreCommand } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { PermissionsBitField, type ChatInputCommandInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';
import { FormattedCustomEmoji, TwemojiRegex } from '@sapphire/discord-utilities';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'emojis',
			description: 'Purge messages that contain emojis in the channel.',
			options: [
				{
					name: 'amount',
					description: 'Amount of messages to delete.',
					type: ApplicationCommandOptionType.Integer,
					min_value: 1,
					max_value: 100,
					required: false
				},
				{
					name: 'visible',
					description: 'Whether the replies should be visible in the channel.',
					type: ApplicationCommandOptionType.Boolean,
					required: false
				}
			],
			defaultMemberPermissions: new PermissionsBitField(['ManageMessages']).bitfield.toString(),
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Manage',
			clientPermissions: ['ManageMessages'],
			userPermissions: ['ManageMessages'],
			guild: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const amount = interaction.options.getInteger('amount') ?? 1;
		const visible = interaction.options.getBoolean('visible') ?? false;

		const respond = await interaction.deferReply({
			...(!visible && { flags: MessageFlags.Ephemeral }),
			withResponse: true
		});

		const reply = respond.resource?.message;
		if (!reply) return;

		const messages = await interaction.channel?.messages.fetch({ limit: 1e2, cache: true, before: reply.id });
		const filter = messages?.filter(
			(m) => (FormattedCustomEmoji.test(m.content) || TwemojiRegex.test(m.content)) && !m.pinned
		);

		const message = Array.from(filter!.values());

		const deleted = await interaction.channel?.bulkDelete(message.slice(0, amount), true);
		if (!deleted?.length) return interaction.editReply({ content: 'No messages were deleted.' });

		return interaction.editReply({
			content: `${bold(italic(deleted.length.toString()))} message(s) have been successfully deleted!`
		});
	}
}
