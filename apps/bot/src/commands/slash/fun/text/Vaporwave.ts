import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'text vaporwave',
			description: 'Transform your text into vaporwave.',
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
