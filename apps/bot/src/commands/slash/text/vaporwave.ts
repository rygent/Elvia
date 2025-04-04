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
			name: 'vaporwave',
			description: 'Transform your text into vaporwave.',
			options: [
				{
					name: 'text',
					description: 'Text to transform.',
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

		return interaction.reply({ content: vaporwave(text) });
	}
}

function vaporwave(input: string): string {
	return input
		.replace(/[a-zA-Z0-9!\\?\\.'";:\]\\[}{\\)\\(@#\\$%\\^&\\*\-_=\\+`~><]/g, (char) =>
			String.fromCharCode(0xfee0 + char.charCodeAt(0))
		)
		.replace(/ /g, '　');
}
