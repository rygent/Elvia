import Command from '../../../../Structures/Interaction.js';
import { vaporwave } from '../../../../Modules/TextGenerator.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['text', 'vaporwave'],
			description: 'Transform your text into vaporwave.'
		});
	}

	async run(interaction) {
		const text = interaction.options.getString('text', true);

		return interaction.reply({ content: vaporwave(text) });
	}

}
