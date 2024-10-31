import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
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
			name: 'mocking',
			description: 'Applies spongemock effect to your text.',
			options: [
				{
					name: 'text',
					description: 'Text to mocking.',
					type: ApplicationCommandOptionType.String,
					max_length: 256,
					required: true
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const text = interaction.options.getString('text', true);

		return interaction.reply({ content: spongemock(text) });
	}
}

function spongemock(input: string): string {
	return input
		.split('')
		.map((char, i) => (i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
		.join('');
}
