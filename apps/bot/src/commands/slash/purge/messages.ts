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

		const reply = response.resource?.message;
		if (!reply?.inGuild()) return;

		const messages = await interaction.channel?.messages.fetch({ limit: 1e2, cache: true, before: reply.id });
		const filter = messages?.filter((m) => !m.pinned);

		const message = Array.from(filter!.values());
		const deleted = await interaction.channel?.bulkDelete(message.slice(0, amount), true);

		const results = {} as object;
		for (const [, msg] of deleted!) {
			const user = msg?.author?.tag;
			if (!Reflect.get(results, user as string)) Reflect.set(results, user as string, 0);
			(results as any)[user as string]++;
		}

		const replies = [
			`${bold(italic(deleted!.size.toString()))} message(s) have been successfully deleted!`,
			`${Object.entries(results)
				.map(([user, size]) => `${italic(`${user}:`)} ${bold(italic(size))}`)
				.join('\n')}`
		].join('\n\n');

		return interaction.editReply({ content: replies });
	}
}
