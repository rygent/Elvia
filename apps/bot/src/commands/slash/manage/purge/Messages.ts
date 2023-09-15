import type { BaseClient } from '#lib/structures/BaseClient.js';
import { Interaction } from '#lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';

export default class extends Interaction {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'purge messages',
			description: 'Purge messages in the channel.',
			category: 'Manage',
			memberPermissions: ['ManageMessages'],
			clientPermissions: ['ManageMessages'],
			guildOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const amount = interaction.options.getInteger('amount') ?? 1;
		const visible = interaction.options.getBoolean('visible') ?? false;

		const reply = await interaction.deferReply({ ephemeral: !visible, fetchReply: true });

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
