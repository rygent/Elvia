import Command from '../../../../Structures/Interaction.js';
import { reverse } from '../../../../Utils/Function.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['text', 'reverse'],
			description: 'Reverse your text.'
		});
	}

	async run(interaction) {
		const text = interaction.options.getString('text', true);

		return interaction.reply({ content: reverse(text) });
	}

}
