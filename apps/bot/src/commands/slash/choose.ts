import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import { type ChatInputCommandInteraction } from 'discord.js';
import { bold } from '@discordjs/formatters';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'choose',
			description: 'Let me make a choice for you.',
			options: [
				{
					name: '1st',
					description: '1st choice.',
					type: ApplicationCommandOptionType.String,
					max_length: 100,
					required: true
				},
				{
					name: '2nd',
					description: '2nd choice.',
					type: ApplicationCommandOptionType.String,
					max_length: 100,
					required: true
				},
				{
					name: '3rd',
					description: '3rd choice.',
					type: ApplicationCommandOptionType.String,
					max_length: 100,
					required: false
				},
				{
					name: '4th',
					description: '4th choice.',
					type: ApplicationCommandOptionType.String,
					max_length: 100,
					required: false
				},
				{
					name: '5th',
					description: '5th choice.',
					type: ApplicationCommandOptionType.String,
					max_length: 100,
					required: false
				},
				{
					name: '6th',
					description: '6th choice.',
					type: ApplicationCommandOptionType.String,
					max_length: 100,
					required: false
				},
				{
					name: '7th',
					description: '7th choice.',
					type: ApplicationCommandOptionType.String,
					max_length: 100,
					required: false
				},
				{
					name: '8th',
					description: '8th choice.',
					type: ApplicationCommandOptionType.String,
					max_length: 100,
					required: false
				},
				{
					name: '9th',
					description: '9th choice.',
					type: ApplicationCommandOptionType.String,
					max_length: 100,
					required: false
				},
				{
					name: '10th',
					description: '10th choice.',
					type: ApplicationCommandOptionType.String,
					max_length: 100,
					required: false
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const requiredChoice = ['1st', '2nd'].map((name) => interaction.options.getString(name, true));
		const optionalChoice = ['3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'].map((name) =>
			interaction.options.getString(name)
		);

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
