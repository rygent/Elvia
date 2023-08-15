import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';
import { formatNumber } from '#lib/utils/Function.js';

const kDice20RegExp = /^(\d+)?\s*d\s*(\d+)\s*(.*?)$/;
const kDice20TrailRegExp = /([+-x*])\s*(\d+)/g;

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'roll',
			description: 'Roll random number with optional minimum and maximum numbers or using a dice.',
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		let minValue = interaction.options.getInteger('min') as number;
		let maxValue = interaction.options.getInteger('max') as number;
		const dice = interaction.options.getString('dice') as string;

		if (dice) {
			const results = kDice20RegExp.exec(dice)!;

			const amount = typeof results[1] === 'undefined' ? 1 : Number(results[1]);
			if (amount < 1 || amount > 1024) {
				return interaction.reply({ content: 'Amount of rolls must be a number between 1 and 1024.', ephemeral: true });
			}

			const dices = Number(results[2]);
			if (dices < 3 || dices > 1024) {
				return interaction.reply({ content: 'Amount of sides must be a number between 3 and 1024.', ephemeral: true });
			}

			let result = generateNumber(amount, amount * dices);
			if (results[3]!.length > 0) result = processModifiers(result, results[3]!);

			return interaction.reply({ content: `🎲 ${bold(dice)}\n${bold(italic('Result:'))} ${result}` });
		}

		const result = generateNumber((minValue ??= 1), (maxValue ??= minValue < 60 ? 100 : minValue + 100));

		return interaction.reply({ content: `You rolled ${bold(formatNumber(result))}!` });
	}
}

function generateNumber(minimum: number, maximum: number) {
	return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}

function processModifiers(output: number, modifiers: string) {
	let modifierResults: RegExpExecArray | null = null;
	while ((modifierResults = kDice20TrailRegExp.exec(modifiers))) {
		output = processModifier(output, modifierResults);
	}

	return output;
}

function processModifier(output: number, modifierResults: RegExpExecArray) {
	const value = Number(modifierResults[2]);
	switch (modifierResults[1] as '+' | '-' | '*' | 'x') {
		case '+':
			return output + value;
		case '-':
			return output - value;
		case 'x':
		case '*':
			return output * value;
	}
}
