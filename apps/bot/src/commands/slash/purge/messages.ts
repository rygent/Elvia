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

export default class extends CoreCommand<ApplicationCommandType.ChatInput> {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'messages',
			description: 'Purge messages in the channel.',
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
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Manage',
			client_permissions: [PermissionFlagsBits.ManageMessages],
			member_permissions: [PermissionFlagsBits.ManageMessages],
			guild_only: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
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
			.then((fetched) => fetched.filter((m) => !m.pinned));

		const deletedMessages = await interaction.channel?.bulkDelete(
			Array.from(fetchedMessages!.values()).slice(0, amount),
			true
		);

		if (!deletedMessages?.size) return interaction.editReply({ content: 'No messages were deleted.' });

		return interaction.editReply({
			content: `${bold(italic(deletedMessages.size.toString()))} message(s) have been successfully deleted!`
		});
	}
}
