import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { PermissionsBitField, type ChatInputCommandInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'ends-with',
			description: 'Purge messages that ends with specified content in the channel.',
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
		const content = interaction.options.getString('content', true);
		const amount = interaction.options.getInteger('amount') ?? 1;
		const visible = interaction.options.getBoolean('visible') ?? false;

		const reply = await interaction.deferReply({
			...(!visible && { flags: MessageFlags.Ephemeral }),
			fetchReply: true
		});

		const messages = await interaction.channel?.messages.fetch({ limit: 1e2, cache: true, before: reply.id });
		const filter = messages?.filter((m) => m.content.endsWith(content) && !m.pinned);

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
