import type BaseClient from '../../../lib/BaseClient.js';
import Command from '../../../lib/structures/Interaction.js';
import { AttachmentBuilder, ChatInputCommandInteraction } from 'discord.js';
import { codeBlock } from '@discordjs/formatters';
import { exec } from 'node:child_process';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'execute',
			description: 'Executes any Bash command.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const bash = interaction.options.getString('bash', true);
		const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

		await interaction.deferReply({ ephemeral });

		exec(bash, (error, stdout) => {
			const replies = codeBlock('console', stdout ?? error).toString();
			if (replies.length <= 2e3) {
				return interaction.editReply({ content: replies });
			}
			const attachment = new AttachmentBuilder(Buffer.from((stdout ?? error).toString()))
				.setName('output.txt');

			return interaction.editReply({ content: 'Output was too long! The result has been sent as a file.', files: [attachment] });
		});
	}
}
