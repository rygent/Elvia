import { Client, Command } from '@elvia/tesseract';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'reverse',
			description: 'Reverse your text.',
			options: [
				{
					name: 'text',
					description: 'Text to reverse.',
					type: ApplicationCommandOptionType.String,
					max_length: 256,
					required: true
				}
			],
			defaultMemberPermissions: null,
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const text = interaction.options.getString('text', true);

		return interaction.reply({ content: reverse(text) });
	}
}

function reverse(input: string): string {
	return input.split('').reverse().join('');
}
