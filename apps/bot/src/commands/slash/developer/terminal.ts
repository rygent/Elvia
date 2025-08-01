import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { AttachmentBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { codeBlock } from '@discordjs/formatters';
import { exec } from 'node:child_process';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'terminal',
			description: 'Execute terminal commands on the system.',
			options: [
				{
					name: 'command',
					description: 'The command you want to execute.',
					type: ApplicationCommandOptionType.String,
					required: true
				},
				{
					name: 'visible',
					description: 'Whether the replies should be visible in the channel.',
					type: ApplicationCommandOptionType.Boolean,
					required: false
				}
			],
			default_member_permissions: '0',
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Developer',
			owner_only: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const bash = interaction.options.getString('command', true);
		const visible = interaction.options.getBoolean('visible') ?? false;

		await interaction.deferReply({ flags: !visible ? MessageFlags.Ephemeral : undefined });

		// eslint-disable-next-line promise/prefer-await-to-callbacks
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
