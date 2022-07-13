import Command from '../../../../Structures/Interaction.js';
import { regional } from '../../../../Modules/TextGenerator.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['text', 'regional'],
			description: 'Transform your text to regional indicators.'
		});
	}

	async run(interaction) {
		const text = interaction.options.getString('text', true);

		return interaction.reply({ content: regional(text) });
	}

}
