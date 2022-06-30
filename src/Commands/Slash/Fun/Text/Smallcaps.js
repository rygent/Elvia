import Command from '../../../../Structures/Interaction.js';
import { smallcaps } from '../../../../Utils/Function.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['text', 'smallcaps'],
			description: 'Transform your text into small caps.'
		});
	}

	async run(interaction) {
		const text = interaction.options.getString('text', true);

		return interaction.reply({ content: smallcaps(text) });
	}

}
