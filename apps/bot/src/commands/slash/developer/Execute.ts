import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import { AttachmentBuilder, ChatInputCommandInteraction } from 'discord.js';
import { codeBlock } from '@discordjs/formatters';
import { exec } from 'node:child_process';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'execute',
			description: 'Executes any Bash command.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const bash = interaction.options.getString('bash', true);
		const visible = interaction.options.getBoolean('visible') ?? false;

		await interaction.deferReply({ ephemeral: !visible });

		exec(bash, (error, stdout) => {
			const replies = codeBlock('console', stdout ?? error).toString();
			if (replies.length <= 2e3) {
				return interaction.editReply({ content: replies });
			}
			const attachment = new AttachmentBuilder(Buffer.from((stdout ?? error).toString())).setName('output.txt');

			return interaction.editReply({
				content: 'Output was too long! The result has been sent as a file.',
				files: [attachment]
			});
		});
	}
}
