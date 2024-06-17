import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'text mocking',
			description: 'Applies spongemock effect to your text.',
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
