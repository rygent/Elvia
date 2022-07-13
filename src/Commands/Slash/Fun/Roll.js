import Command from '../../../Structures/Interaction.js';
import { DiceRoll, NumberGenerator } from '@dice-roller/rpg-dice-roller';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['roll'],
			description: 'Roll random number with optional minimum and maximum numbers or using a dice.'
		});
	}

	async run(interaction) {
		const minValue = interaction.options.getInteger('min');
		const maxValue = interaction.options.getInteger('max');
		const dice = interaction.options.getString('dice');

		if (dice) {
			const roll = new DiceRoll(dice);

			return interaction.reply({ content: `🎲 **${roll.notation}**\n**Result:** ${roll.total}` });
		} else {
			const { generator } = NumberGenerator;
			const roller = generator.integer(!minValue ? 1 : minValue, !maxValue ? minValue < 60 ? 100 : minValue + 100 : maxValue);

			return interaction.reply({ content: `You rolled **${roller}**!` });
		}
	}

}
