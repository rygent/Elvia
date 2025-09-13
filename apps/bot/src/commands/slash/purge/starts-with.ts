import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags,
	PermissionFlagsBits
} from 'discord-api-types/v10';
import { type ChatInputCommandInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'starts-with',
			description: 'Purge messages that starts with specified content in the channel.',
			options: [
				{
					name: 'content',
					description: 'Content to match.',
					type: ApplicationCommandOptionType.String,
					required: true
				},
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
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Manage',
			client_permissions: [PermissionFlagsBits.ManageMessages],
			member_permissions: [PermissionFlagsBits.ManageMessages],
			guild_only: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const content = interaction.options.getString('content', true);
		const amount = interaction.options.getInteger('amount') ?? 1;
		const visible = interaction.options.getBoolean('visible') ?? false;

		const response = await interaction.deferReply({
			flags: !visible ? MessageFlags.Ephemeral : undefined,
			withResponse: true
		});

		const message = response.resource?.message;
		if (!message?.inGuild()) return;

		const fetchedMessages = await interaction.channel?.messages
			.fetch({ limit: 1e2, cache: true, before: message.id })
			.then((fetched) => fetched.filter((m) => m.content.startsWith(content) && !m.pinned));

		const deletedMessages = await interaction.channel?.bulkDelete(
			Array.from(fetchedMessages!.values()).slice(0, amount),
			true
		);

		if (!deletedMessages?.length) return interaction.editReply({ content: 'No messages were deleted.' });

		return interaction.editReply({
			content: `${bold(italic(deletedMessages.length.toString()))} message(s) have been successfully deleted!`
		});
	}
}
