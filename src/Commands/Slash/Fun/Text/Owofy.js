import Command from '../../../../Structures/Interaction.js';
import { owofy } from '../../../../Utils/Function.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['text', 'owofy'],
			description: 'Transform your text into owo and uwu.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);

		return interaction.reply({ content: owofy(text) });
	}

}
