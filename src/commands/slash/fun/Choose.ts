import type BaseClient from '../../../lib/BaseClient.js';
import Command from '../../../lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold } from '@discordjs/formatters';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'choose',
			description: 'Let me make a choice for you.',
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const requiredChoice = ['1st', '2nd'].map(name => interaction.options.getString(name, true));
		const optionalChoice = ['3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
			.map(name => interaction.options.getString(name));

		const options = [...requiredChoice, ...optionalChoice];

		const words = filterWords(options as string[])!;
		const word = words[Math.floor(Math.random() * words.length)];

		return interaction.reply({ content: `I'm choosing ${bold(word as string)}!` });
	}
}

function filterWords(words: string[]) {
	const output = new Set<string>();
	const filtered = new Set<string>();

	for (const word of words) {
		if (!word) continue;
		if (output.has(word)) filtered.add(word);
		else output.add(word);
	}

	if (output.size >= 2) return [...output];
}
